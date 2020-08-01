export type IDatabaseMachineId = string;
export type IDatabaseMachineSubId = string;
export type IDatabaseMachineType = 'tvr' | 'tng' | 'tpg';

export interface IDatabaseEvent {
	id: number;
	created_at: Date;
	sandbox: boolean;

	machine_id: IDatabaseMachineId;
	machine_subid: IDatabaseMachineSubId;
	machine_type: IDatabaseMachineType;
	machine_status: 'playing' | 'idle' | 'error';

	game_id: string | null;
	game_name: string | null;
	game_players: number | null;

	comment: string | null;
	is_dispatched: boolean;
}


export interface IDatabaseGameRun {
	id: number;
	created_at: Date;

	machine_id: string;
	machine_type: string;

	start_at: Date;
	end_at: Date | null;

	game_id: string | null;
	game_name: string | null;
	game_players: number;

	comment: string | null;
}

export interface IDatabaseMachine {
	machine_id: IDatabaseMachineId;
	machine_type: IDatabaseMachineType;
	api_url: string | null;
	location: string | null;
	use: string | null;
}

export interface IDatabaseMachineStatus {
	machine_id: IDatabaseMachineId;
	machine_type: IDatabaseMachineType;
	machine_status: 'playing' | 'idle' | 'error';
	updated_at: Date;
	game_id: string | null;
	game_name: string | null;
}