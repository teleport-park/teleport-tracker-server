import * as Knex from 'knex';
import {TABLE_NAME} from './20200722043959_create_events';

export const up = async (knex: Knex) => {
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.string('machine_subid', 100)
			.nullable();
	});
}

export const down = async (knex: Knex) => {
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.dropColumn('machine_subid');
	});
}
