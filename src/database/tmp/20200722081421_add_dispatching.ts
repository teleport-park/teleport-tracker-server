import * as Knex from 'knex';
import { TABLE_NAME } from '../migrations/20200722043959_create_events';

export const up = async (knex: Knex) => {
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.boolean('is_dispatched')
			.notNullable()
			.defaultTo(false)
			.index();
	});
}

export const down = async (knex: Knex) => {
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.dropColumn('is_dispatched');
	});
}
