import * as Knex from 'knex';

export const TABLE_NAME = 'game_runs';

export const up = async (knex: Knex) => {
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.comment('Events from machines are stored here');

		// Basic fields
		tableBuilder.bigIncrements('id')
			.notNullable()
			.primary();

		tableBuilder.timestamp('created_at')
			.notNullable()
			.defaultTo(knex.fn.now()).notNullable();


		// Machine info
		tableBuilder.string('machine_id')
			.notNullable();

		tableBuilder.string('machine_type', 10)
			.notNullable();

		// Run info
		tableBuilder.timestamp('start_at')
			.notNullable();

		tableBuilder.timestamp('end_at')
			.nullable();

		// Game info
		tableBuilder.string('game_id', 100)
			.nullable();

		tableBuilder.string('game_name', 100)
			.nullable();

		tableBuilder.integer('game_players')
			.unsigned()
			.notNullable()

		// Comment
		tableBuilder.string('comment', 200)
			.nullable();



	});
}

export const down = async (knex: Knex) => {
	await knex.schema.dropTableIfExists(TABLE_NAME);
}
