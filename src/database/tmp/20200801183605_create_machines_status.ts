import * as Knex from 'knex';
import {MACHINE_STATUS_TYPENAME, MACHINE_STATUSES, MACHINE_TYPES} from '../migrations/20200722043959_create_events';

export const TABLE_NAME = 'machines_status';

export const up = async (knex: Knex) => {
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {

		tableBuilder.string('machine_id')
			.notNullable();

		tableBuilder.enum('machine_type', MACHINE_TYPES)
			.notNullable();

		tableBuilder.primary(['machine_id', 'machine_type']);
	});

	// // status actions
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {

		tableBuilder.specificType('machine_status', MACHINE_STATUS_TYPENAME)
			.notNullable();

		tableBuilder.string('game_id', 100)
			.nullable();
		tableBuilder.string('game_name', 100)
			.nullable();

		tableBuilder.timestamp('updated_at')
			.notNullable();

	});

}

export const down = async (knex: Knex) => {
	await knex.schema.dropTableIfExists(TABLE_NAME);
}
