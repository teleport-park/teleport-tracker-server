import * as Knex from 'knex';

export const TABLE_NAME = 'machine_events';
export const MACHINE_TYPES = ['tvr', 'tng', 'tpg'];
export const MACHINE_TYPE_TYPENAME = 'machine_types';
export const MACHINE_STATUSES = ['idle', 'playing', 'error'];
export const MACHINE_STATUS_TYPENAME = 'machine_statuses';

export const up = async (knex: Knex) => {

	await knex.schema.raw(`CREATE TYPE ${MACHINE_TYPE_TYPENAME} AS ENUM ('${MACHINE_TYPES.join('\',\'')}')`);
	await knex.schema.raw(`CREATE TYPE ${MACHINE_STATUS_TYPENAME} AS ENUM ('${MACHINE_STATUSES.join('\',\'')}')`);

	// base definitions
	await knex.schema.createTable(TABLE_NAME, (tableBuilder) => {
		tableBuilder.comment('Events from machines are stored here');

		// Basic fields
		tableBuilder.bigIncrements('id')
			.notNullable()
			.primary();

		tableBuilder.timestamp('created_at')
			.notNullable()
			.defaultTo(knex.fn.now()).notNullable();

		tableBuilder.boolean('sandbox')
			.notNullable()
			.defaultTo(false);
	});

	// event details
	await knex.schema.alterTable(TABLE_NAME, (tableBuilder) => {
		// Machine info
		tableBuilder.string('machine_id')
			.notNullable();
		tableBuilder.specificType('machine_type', MACHINE_TYPE_TYPENAME)
			.notNullable();
		tableBuilder.specificType('machine_status', MACHINE_STATUS_TYPENAME)
			.notNullable();

		// Game info
		tableBuilder.string('game_id', 100)
			.nullable();
		tableBuilder.string('game_name', 100)
			.nullable();
		tableBuilder.integer('game_players')
			.unsigned()
			.nullable();

		// Misc
		tableBuilder.string('comment', 200)
			.nullable();
	});
}

export const down = async (knex: Knex) => {
	// TODO throw because of production use
	throw new Error('Unable to rollback here');
	await knex.schema.dropTableIfExists(TABLE_NAME);
	await knex.schema.raw(`DROP TYPE ${MACHINE_STATUS_TYPENAME}`);
	await knex.schema.raw(`DROP TYPE ${MACHINE_TYPE_TYPENAME}`);
}
