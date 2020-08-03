export type IDatabaseMachineId = string;
export type IDatabaseMachineSubId = string;
export type IDatabaseMachineType = 'tvr' | 'tng' | 'tpg';
export type IDatabaseMachineStatus = 'playing' | 'idle' | 'error';

export interface IDatabaseEvent {
	id: number;
	created_at: Date;
	sandbox: boolean;

	machine_id: IDatabaseMachineId;
	machine_subid: IDatabaseMachineSubId;
	machine_type: IDatabaseMachineType;
	machine_status: IDatabaseMachineStatus;

	game_id: string | null;
	game_name: string | null;
	game_players: number | null;

	comment: string | null;
	is_dispatched: boolean;
}

export interface IDatabaseMachine {
	id: number;
	machine_id: IDatabaseMachineId;
	machine_type: IDatabaseMachineType;
	api_url: string | null;
	location_name: string | null;
	use: string | null;
}

export interface IDatabaseMachineState {
	id: IDatabaseMachine['id'];
	sub_id: string | null;
	updated_at: Date;
	status: IDatabaseMachineStatus;
}

export interface IDatabaseGameRun {
	id: number;
	machine_id: IDatabaseMachine['id'];
	created_at: Date;

	start_at: Date;
	end_at: Date | null;

	game_id: string | null;
	game_name: string | null;
	game_players: number;

	comment: string | null;
}