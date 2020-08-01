import * as Ajv from 'ajv';

export type IApiMachineType = 'tvr' | 'tng' | 'tpg';
export type IApiMachineId = string;

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

