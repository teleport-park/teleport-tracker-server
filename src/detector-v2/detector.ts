import * as debug from 'debug';

export type DetectorMachineId = [string, string, string];

export interface IDetectorMachineState {
	status: 'playing' | 'idle';
	run: IDetectorSession;
}

export interface IDetectorSession {
	startedAt: Date;
	stoppedAt: Date;
}

export class Detector<M> {
	protected readonly logger: debug.IDebugger = debug('detector');
	protected readonly machines: Map<M, IDetectorMachineState> = new Map();
	protected readonly sessions: IDetectorSession[] = [];


	// public register();

	public feed(machine: M, status?) {

		// find machine
		if (!this.machines.has(machine)) {
			this.logger('New machine found: %o', machine);
			this.machines.set(machine, {
				status: null,
				run: null,
			});
		}

		// instance
		const instance = this.machines.get(machine);


	}

}
