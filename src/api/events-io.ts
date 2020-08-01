import * as Ajv from 'ajv';
import {IApiGame} from './router-io';
import {JSONSchema7} from 'json-schema';

export interface IApiEvent {
	id: string;
	sub_id?: string;
	type: 'tvr' | 'tng' | 'tpg';
	status: 'idle' | 'playing';
	timestamp: Date;
	game?: IApiEventGame;
	comment?: string;
}

export interface IApiEventGame {
	id: string;
	name?: string;
	players?: number;
}

export type IApiEventsResponse = IApiEvent[];

export interface IApiEventCreateRequest {
	id: string;
	sub_id: string | null;
	type: 'tvr' | 'tng' | 'tpg';
	status: 'idle' | 'playing';
	timestamp?: Date;
	local_timestamp?: Date;
	game?: IApiGame;
	comment?: string;
	sandbox?: boolean;
}

export const ApiEventRequestSchema: JSONSchema7 = {
	type: 'object',
	required: ['id', 'type', 'status'],
	properties: {
		id: {type: 'string', minLength: 1},
		sub_id: {type: 'string', minLength: 1, default: null},
		type: {type: 'string', enum: ['tvr', 'tng', 'tpg']},
		status: {type: 'string', enum: ['idle', 'playing']},

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

		comment: {type: 'string', minLength: 1},
		sandbox: {type: 'boolean'},
	}
}

export const ApiEventRequestValidator = (new Ajv()).compile(ApiEventRequestSchema);

export type IApiEventCreateResponse = IApiEvent;
