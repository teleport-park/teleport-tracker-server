import {db, defaultLogger} from './bootstrap';
import {IDatabaseEvent, IDatabaseMachine, IDatabaseMachineStatus} from './database';
import {Detector} from './detector-v2/detector';

const logger = defaultLogger.extend('detector');

(async () => {

	const trx = db;

	logger('Starting iteration');

	// Load bulk of events
	const events: IDatabaseEvent[] = await trx.table('machine_events')
		.select()
		.orderBy('created_at', 'asc')
		// .where('is_dispatched', false)
		.limit(10000);
	logger('Loaded %i events from database', events.length);

	// convert to structure of events
	const split = events.reduce<IMachine[]>((machines, event) => {
		const {machine_id, machine_type, machine_subid} = event;

		// find machine in acc or create it
		let machine = machines.find((s) => (s.id.id === machine_id && s.id.type === machine_type && s.id.subId === machine_subid));
		if (!machine) {
			machine = {
				id: {id: machine_id, type: machine_type, subId: machine_subid},
				// status: {status: null, timestamp: null},
				events: [],
			};
			machines.push(machine);
		}

		// add event to machine
		machine.events.push({
			id: event.id,
			status: event.machine_status,
			timestamp: event.created_at,
			comment: event.comment,
			...((event.game_id || event.game_name || event.game_players)
				? {game: {id: event.game_id, name: event.game_name, players: event.game_players}}
				: {})
		});

		return machines;
	}, []);


	// TODO fulfill with status from database with foreach


	for (const machine of split) {
		// TODO load machine current status and game run


		for (const event of machine.events) {

			switch (event.status) {

				case 'idle':
					switch (machine.status.status) {
						// No action here, just set action
						case 'idle':
							break;

						// Start new game run on machine
						case 'playing':
							// TODO start new game run
							logger('Starting game run');
							break;

						// Do nothing
						case 'error':
							break;

						default:
							throw new Error('Unknown machine status: ' + machine.status.status);
					}
					break;

				case 'playing':
					switch (machine.status.status) {

						// Stop existing game run
						case 'idle':
							logger('Stopping game run');
							break;

						// Check game matches
						case 'playing':
						case 'error':
							// TODO if game matches, if not - start new run, stop existing run if any
							break;

						default:
							throw new Error('Unknown machine status: ' + machine.status.status);
					}
					break;

				// Ignore case, error happen on machine, don't change anything
				case 'error':
					switch (machine.status.status) {
						case 'idle':
							break;
						case 'playing':
							break;
						case 'error':
							break;
						default:
							throw new Error('Unknown machine status: ' + machine.status.status);
					}
					break;
				default:
					throw new Error('Unknown status');
			}

		}

	}


	// 	// find machine
	// 	let machine = machines.find((m) => m.machine_id === event.machine_id && m.machine_type === event.machine_type);
	// 	if (!machine) {
	// 		// add new machine to the list
	// 		machine = {
	// 			machine_id: event.machine_id,
	// 			machine_type: event.machine_type,
	// 			machine_status: 'idle',
	// 			game_id: null,
	// 			game_name: null,
	// 			updated_at: null,
	// 		}
	// 		machines.push(machine);
	// 		logger('New machine added: %s (%s)', machine.machine_id, machine.machine_type);
	// 	}
	// 	// TODO dispatching
	// 	// TODO FSM run
	// }

	// Update database with new status map
	// TODO

})().then(() => {
	logger('Done');
	return db.destroy();
});


interface IMachine {
	id: IMachineId;
	status?: IMachineStatus;
	events: IMachineEvent[];
	run?: IMachineGameRun;
}

interface IMachineId {
	id: string;
	type: string;
	subId: string;
}

interface IMachineStatus {
	status: 'idle' | 'playing' | 'error';
	game?: IMachineGame;
	timestamp: Date;
}

interface IMachineGame {
	id: string;
	name: string;
	players: number;
}

interface IMachineEvent extends IMachineStatus {
	id: number;
	comment: string;
}

interface IMachineGameRun {
	game: IMachineGame;
	startedAt: Date;
	endedAt: Date;
}

function matchStatus(a: IMachineStatus, b: IMachineStatus): boolean {
	return false;
}



