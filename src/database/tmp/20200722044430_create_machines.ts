import * as Knex from 'knex';
import {MACHINE_STATUSES, MACHINE_TYPES} from '../migrations/20200722043959_create_events';

export const TABLE_NAME = 'machines';

export const up = async (knex: Knex) => {
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {

		tableBuilder.string('machine_id')
			.notNullable();

		tableBuilder.enum('machine_type', MACHINE_TYPES)
			.notNullable();

		tableBuilder.primary(['machine_id', 'machine_type']);


	});

	// status actions
	// await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
	//
	// 	tableBuilder.timestamp('updated_at')
	// 		.notNullable()
	// 		.defaultTo(knex.fn.now())
	//
	// 	tableBuilder.enum('machine_status', MACHINE_STATUSES).nullable();
	//
	// });

	// add meaning fields for machines
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
	await knex.schema.dropTableIfExists(TABLE_NAME);
}
