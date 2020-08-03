/**
 * Creates machines
 */
import * as Knex from 'knex';
import {MACHINE_TYPE_TYPENAME} from './20200722043959_create_events';

export const TABLE_NAME = 'machines';

export const up = async (knex: Knex) => {

	// main machies table
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {

		tableBuilder.bigIncrements('id')
			.notNullable()
			.comment('Machine ID');
		tableBuilder.string('machine_id')
			.notNullable();
		tableBuilder.specificType('machine_type', MACHINE_TYPE_TYPENAME)
			.notNullable();
		tableBuilder.unique(['machine_id', 'machine_type']);
	});

	// optional machine metadata
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.string('api_url')
			.nullable();
		tableBuilder.string('location_name')
			.nullable();
		tableBuilder.string('use')
			.nullable();
	});

}

export const down = async (knex: Knex) => {
	await knex.schema.dropTable(TABLE_NAME);
}