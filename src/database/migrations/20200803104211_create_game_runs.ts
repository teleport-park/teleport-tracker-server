import * as Knex from 'knex';
import {TABLE_NAME as MACHINES_TABLE_NAME} from './20200802135055_create_machines';

export const TABLE_NAME = 'game_runs';

export const up = async (knex: Knex) => {
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.comment('Runs from machines are stored here');

		// Basic fields
		tableBuilder.bigIncrements('id')
			.notNullable()
			.primary();

		tableBuilder.bigInteger('machine_id')
			.notNullable();

		tableBuilder.foreign('machine_id').references(`${MACHINES_TABLE_NAME}.id`)

		tableBuilder.timestamp('created_at')
			.notNullable()
			.defaultTo(knex.fn.now()).notNullable();

	});

	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {

		// Run info
		tableBuilder.timestamp('start_at')
			.notNullable();

		tableBuilder.timestamp('end_at')
			.nullable();

		tableBuilder.string('game_id', 100)
			.nullable();

		tableBuilder.string('game_name', 100)
			.nullable();

		tableBuilder.integer('game_players')
			.unsigned()
			.notNullable();

		tableBuilder.string('comment', 200)
			.nullable();

	});

}

export const down = async (knex: Knex) => {
	await knex.schema.dropTableIfExists(TABLE_NAME);
}
