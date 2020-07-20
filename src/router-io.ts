import * as Ajv from 'ajv';

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
	};
}

export interface IApiEventCreateRequest {
	id: string;
	type: 'tvr' | 'tng' | 'tpg';
	status: 'idle' | 'playing';
	comment?: string;
	local_timestamp: Date;
	game?: {
		id: string;
		name?: string;
	};
}

export const ApiEventRequestSchema = {
	type: 'object',
	required: ['id', 'type', 'status', 'timestamp'],
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
			},
		},
	}
}

export const ApiEventRequestValidator = (new Ajv()).compile(ApiEventRequestSchema);

export type IApiEventCreateResponse = IApiEvent;
