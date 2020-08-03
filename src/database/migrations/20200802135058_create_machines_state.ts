/**
 * Creates machines status table
 */
import * as Knex from 'knex';
import { TABLE_NAME as MACHINES_TABLE_NAME } from './20200802135055_create_machines';
import {MACHINE_STATUS_TYPENAME, MACHINE_STATUSES} from './20200722043959_create_events';

export const TABLE_NAME = 'machines_state';

export const up = async (knex: Knex) => {

	// main statuses table
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {

		tableBuilder.bigInteger('id')
			.notNullable();

		tableBuilder.string('sub_id')
			.nullable();

		tableBuilder.primary(['id', 'sub_id']);
		tableBuilder.foreign('id').references(`${MACHINES_TABLE_NAME}.id`);
	});

	// optional machine status data
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {

		tableBuilder.timestamp('updated_at')
			.notNullable()
			.defaultTo(knex.fn.now())

		tableBuilder.specificType('status', MACHINE_STATUS_TYPENAME)
			.notNullable()
			.defaultTo(MACHINE_STATUSES[0]);

	});

}

export const down = async (knex: Knex) => {
	await knex.schema.dropTable(TABLE_NAME);
}