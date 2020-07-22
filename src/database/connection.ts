import * as Knex from 'knex';
import * as dbConfig from '../../knexfile.js';
import * as util from 'util';

export type DatabaseConnection = Knex;

export function createConnection(env?: string): DatabaseConnection {

	const databaseContext = env || process.env.NODE_ENV || 'development';

	if (!dbConfig[databaseContext]) {
		throw new Error(util.format('Unable to find database environment [%s]', databaseContext));
	}
	const databaseConfig = dbConfig[databaseContext];
	console.log(util.format('Unsing database config [%s]', databaseContext));
	return Knex(databaseConfig);
}


