import {IApiGame, IApiMachineId, IApiMachineType} from '../router-io';

export interface IDatabaseEvent {
	id: number;
	created_at: Date;
	machine_id: string;
	machine_type: string;
	machine_status: string;
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
