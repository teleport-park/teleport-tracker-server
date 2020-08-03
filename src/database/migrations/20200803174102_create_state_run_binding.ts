import * as Knex from 'knex';
import {TABLE_NAME as MACHINES_STATE_TABLE_NAME} from './20200802135058_create_machines_state';
import {TABLE_NAME as GAME_RUNS_TABLE_NAME} from './20200803104211_create_game_runs';

export const up = async (knex: Knex) => {
	await knex.schema.alterTable(MACHINES_STATE_TABLE_NAME, (tableBuilder) => {
		tableBuilder.bigInteger('game_run_id')
			.nullable()
			.references(`${GAME_RUNS_TABLE_NAME}.id`);
	});
};

export const down = async (knex: Knex) => {
	await knex.schema.alterTable(MACHINES_STATE_TABLE_NAME, (tableBuilder) => {
		tableBuilder.dropColumn('game_run_id');
	});
};
