import * as async from 'async';
import {db, defaultLogger} from './bootstrap';
import {IDatabaseEvent, IDatabaseGameRun, IDatabaseMachine, IDatabaseMachineState} from './database';
import {Transaction} from 'knex';

const logger = defaultLogger.extend('detector');

async.forever(async (next) => {
	let num: number;
	const trx = await db.transaction();
	try {
		num = await detect(trx, 50000);
		logger('Processed %s events', num);
		await trx.commit();
	} catch (e) {
		await trx.rollback();
		throw e;
	}
}, (err) => {
	throw err;
});

async function detect(trx: Transaction, bulkSize: number = 10000): Promise<number> {

	// drop dbs
	// logger('Dropping existing runs and states');
	// await trx.table('machines_state').delete();
	// await trx.table('game_runs').delete();
	// await trx.table('machine_events').update('dispatched_at', null).whereNotNull('dispatched_at');

	logger('Starting iteration');

	// Load bulk of events
	const events: IDatabaseEvent[] = await trx.table('machine_events')
		.select()
		.orderBy('created_at', 'asc')
		.whereNull('dispatched_at')
		.where('created_at', '<', trx.raw('NOW() - INTERVAL \'3m\''))
		.limit(bulkSize);
	logger('Loaded %i events from database', events.length);

	const machinesCache: IDatabaseMachine[] = [];
	const machineStatesCache: IDatabaseMachineState[] = [];

	for (const event of events) {

		if (event.machine_subid === null) {
			event.machine_subid = '';
		}

		// find machine for event
		let machine = machinesCache.find((m) => m.machine_id === event.machine_id && m.machine_type === event.machine_type);
		if (!machine) {
			// create new machine and put it into database and cache
			machine = await trx.raw(
				'INSERT INTO machines (machine_id, machine_type) VALUES (?, ?) ON CONFLICT (machine_id, machine_type) DO UPDATE SET touch_at = NOW() RETURNING *;',
				[event.machine_id, event.machine_type],
			).then((resp) => resp.rows[0]);
			machinesCache.push(machine);
			logger('New session machine detected: (%s, %s) => %s', machine.machine_id, machine.machine_type, machine.id);
		}
		if (!machine) {
			throw new Error('Unable to process event due no machine is found');
		}

		// find state for event
		let machineState = machineStatesCache.find((ms) => event.machine_subid === ms.sub_id && machine.id === ms.id);
		if (!machineState) {
			machineState = await trx.raw(
				'INSERT INTO machines_state (id, sub_id) VALUES (?, ?) ON CONFLICT (id, sub_id) DO UPDATE SET touch_at = NOW() RETURNING *;',
				[machine.id, event.machine_subid]
			).then((resp) => resp.rows[0]);
			machineStatesCache.push(machineState);
			logger('New session machine state detected: (%s, %s, %s) => %s', machineState.id, machineState.sub_id, machineState.status, machineState.id);
		}
		if (!machineState) {
			throw new Error('Unable to process event due no machine state is set');
		}

		// Start processing event details
		// TODO skip if event earlier than latest ones
		// if (machineState.updated_at != null && event.created_at.getTime() < machineState.updated_at.getTime()) {
		// 	logger('Detected event earlier than current machine state');
		// 	continue;
		// }

		if (event.machine_status === 'playing' && machineState.status === 'idle') {
			// Stop existing game run
			if (machineState.game_run_id) {
				await trx.table('game_runs').update({end_at: event.created_at}).where('id', machineState.game_run_id);
				machineState.game_run_id = null;
			}

			// Start new game run
			const [gameRun] = await trx.table<IDatabaseGameRun>('game_runs').insert({
				machine_id: machine.id,
				start_at: event.created_at,
				game_id: event.game_id,
				game_name: event.game_name,
				game_players: event.game_players,
				comment: event.comment,
			}).returning('*');

			machineState.game_run_id = gameRun.id;
			machineState.status = 'playing';
		} else if (event.machine_status === 'idle' && machineState.status === 'playing') {
			// Stop existing game run
			if (machineState.game_run_id) {
				await trx.table('game_runs').update({end_at: event.created_at}).where('id', machineState.game_run_id);
				machineState.game_run_id = null;
			}
			machineState.status = 'idle';
		}

		machineState.updated_at = event.created_at;

	}

	// mark events as processed
	await trx.table<IDatabaseEvent>('machine_events').update('dispatched_at', trx.fn.now()).whereIn('id', events.map((e) => e.id));

	// saving states
	await Promise.all(machineStatesCache.map((s) => {
		return trx.table<IDatabaseMachineState>('machines_state').update({
			status: s.status,
			updated_at: s.updated_at,
		}).where({id: s.id, sub_id: s.sub_id});
	}))

	return events.length;
}


