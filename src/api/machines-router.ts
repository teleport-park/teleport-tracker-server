import * as KoaRouter from 'koa-router';
import {DatabaseConnection, IDatabaseMachine, MACHINES_TABLE_NAME} from '../database';
import {IApiMachine, IApiMachinesResponse} from './machines-io';

export function createMachinesRouter(db: DatabaseConnection): KoaRouter {
	const router = new KoaRouter();

	router.get('/machines', async (ctx) => {
		// get machines from database and reformat
		const machines: IDatabaseMachine[] = await db.table(MACHINES_TABLE_NAME).select('*');
		const response: IApiMachinesResponse = machines.map(createApiMachineFromDatabaseMachine);
		ctx.status = 200;
		ctx.body = response;
	});

	return router;
}

function createApiMachineFromDatabaseMachine(dbMachine: IDatabaseMachine): IApiMachine {
	return {
		id: dbMachine.machine_id,
		type: dbMachine.machine_type,
		address: dbMachine.api_url || undefined,
		location: dbMachine.location || undefined,
		use: dbMachine.use || undefined,
	}
}
