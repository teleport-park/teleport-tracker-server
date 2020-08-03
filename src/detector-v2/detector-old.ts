import * as debug from 'debug';
import {EventEmitter} from 'events';

interface MachineState {
	status: string;
	updated: number;
	touch: number;
}

export interface IDetectorEvents extends EventEmitter {
	on<T>(event: 'start' | 'stop', listener: (meta: T) => void);
}

export class Detector extends EventEmitter implements IDetectorEvents {

	protected readonly logger: debug.IDebugger = debug('detector');
	protected readonly machines: Map<string, MachineState>

	public constructor() {
		super();
		this.machines = new Map();
		this.logger('Initialized');
	}

	public receive<T>(id: string, status: string, date: Date, meta?: T) {
		// TODO something

		// take ID and detect if machine created
		if (!this.machines.has(id)) {
			this.machines.set(id, {
				status: null,
				updated: null,
				touch: Date.now(),
			});
			this.logger('New machine %o created', id);
		}

		const eventTimestamp = date.getTime();
		// receive machine state
		const machineState = this.machines.get(id);
		machineState.touch = Date.now();

		// here's transition to machine state
		if (machineState.status === status) {
			// do nothing
			return;
		} else if (machineState.updated > eventTimestamp) {
			this.logger('Event is earlier than latest one');
		}

		// status changed, define process
		this.logger('Status changed %o => %o', machineState.status, status);

		if (status === 'playing') {
			this.logger('Game run detected')
			setImmediate(() => this.emit('start', meta));
		} else if (machineState.status !== null) {
			this.logger('Game run stopped')
			setImmediate(() => this.emit('stop', meta));
		}

		machineState.status = status;
		machineState.updated = eventTimestamp;

	}

}
