import * as Ajv from 'ajv';


export type IApiMachineType = 'tvr' | 'tng' | 'tpg';
export type IApiMachineId = string;

export interface IApiEvent {
	id: string;
	type: 'tvr' | 'tng' | 'tpg';
	status: 'idle' | 'playing';
	comment?: string;
	timestamp: Date;
	local_timestamp: Date;
	game?: {
		id: string;
		name?: string;
		players: number;
	};
}

export interface IApiGame {
	id: string;
	name?: string;
	players?: number;
}

export interface IApiRun {
	id: IApiMachineId;
	type: IApiMachineType;
	location?: string;
	start_at: Date;
	end_at: Date;
	game: IApiGame;
}

export type IApiEventsResponse = IApiEvent[];

export interface IApiEventCreateRequest {
	id: string;
	type: 'tvr' | 'tng' | 'tpg';
	status: 'idle' | 'playing';
	comment?: string;
	local_timestamp: Date;
	game?: IApiGame;
}

export const ApiEventRequestSchema = {
	type: 'object',
	required: ['id', 'type', 'status'],
	properties: {
		id: {type: 'string'},
		status: {type: 'string', enum: ['idle', 'playing']},
		comment: {type: 'string'},
		timestamp: {type: 'string', format: 'date-time'},
		local_timestamp: {type: 'string', format: 'date-time'},
		game: {
			type: 'object',
			required: ['id'],
			properties: {
				id: {type: 'string'},
				name: {type: 'string'},
				players: {type: 'number'},
			},
		},
	}
}

export const ApiEventRequestValidator = (new Ajv()).compile(ApiEventRequestSchema);

export type IApiEventCreateResponse = IApiEvent;

export type IApiRunsResponse = IApiRun[];


export interface IApiRunsRequestQuery {
	l: number;
	o: number;
	from?: Date;
	to?: Date;
}

export const ApiRunsRequestQuerySchema = {
	type: 'object',
	properties: {
		o: {type: 'integer', minimum: 0, default: 0},
		l: {type: 'integer', minimum: 0, default: 100},
		from: {type: 'string', format: 'date-time'},
		to: {type: 'string', format: 'date-time'},
		export: {type: 'boolean', default: false},
	}
}

export const ApiRunsRequestQueryValidator = (new Ajv({
	coerceTypes: true,
	useDefaults: true,
})).compile(ApiRunsRequestQuerySchema);

