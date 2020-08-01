import {db, defaultLogger} from './bootstrap';
import {IDatabaseEvent, IDatabaseMachineStatus} from './database';

const logger = defaultLogger.extend('detector');

(async () => {

	logger('Starting iteration');

	// Load machines from database
	const machines: IDatabaseMachineStatus[] = await db.table('machines_status').select();
	logger('Loaded %i status records from database', machines.length);
	logger(machines);

	// Load bulk of events
	const events: IDatabaseEvent[] = await db.table('machine_events')
		.select()
		.orderBy('created_at', 'asc')
		// .where('is_dispatched', false)
		.limit(1000);
	logger('Loaded %i events from database', events.length);

	// Iterate on events and generate statuses
	for (const event of events) {
		// find machine
		let machine = machines.find((m) => m.machine_id === event.machine_id && m.machine_type === event.machine_type);
		if (!machine) {
			// add new machine to the list
			machine = {
				machine_id: event.machine_id,
				machine_type: event.machine_type,
				machine_status: 'idle',
				game_id: null,
				game_name: null,
				updated_at: null,
			}
			machines.push(machine);
			logger('New machine added: %s (%s)', machine.machine_id, machine.machine_type);
		}
		// TODO dispatching
		// TODO FSM run
	}

	// Update database with new status map
	// TODO

})().then(() => {
	logger('Done');
	return db.destroy();
});






