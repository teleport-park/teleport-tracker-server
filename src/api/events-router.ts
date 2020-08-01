import * as KoaRouter from 'koa-router';
import {DatabaseConnection, IDatabaseEvent} from '../database';
import {IApiEventsResponse, IApiEvent, IApiEventGame, IApiEventCreateRequest, ApiEventRequestValidator, IApiEventCreateResponse} from './events-io';

export function createEventsRouter(db: DatabaseConnection): KoaRouter {
	const router = new KoaRouter();

	router.get('/events', async (ctx) => {
		const events = await db.table<IDatabaseEvent>('machine_events')
			.select()
			.orderBy('created_at', 'desc')
			.limit(100);

		const response: IApiEventsResponse = events.map(createApiEventFromDatabaseEvent);
		ctx.status = 200;
		ctx.body = response;
	});

	router.post('/events', async (ctx) => {
		const request: IApiEventCreateRequest = ctx.request.body;
		ctx.assert.ok(ApiEventRequestValidator(request), 400, 'Invalid request', {
			error: 'invalid-request',
			messages: ApiEventRequestValidator.errors,
		});

		const {id: machineId, type: machineType} = request;

		// await db.raw(
		// 	'INSERT INTO machines (machine_id, machine_type) VALUES (?, ?) ON CONFLICT (machine_id, machine_type) DO NOTHING',
		// 	[machineId, machineType]
		// );

		const inserts: IDatabaseEvent[] = await db.table('machine_events')
			.returning('*')
			.insert(createDatabaseEventFromApiEventCreateRequest(request));

		const response: IApiEventCreateResponse = createApiEventFromDatabaseEvent(inserts[0]);
		ctx.status = 201;
		ctx.body = response;
	});

	return router;
}

function createApiEventFromDatabaseEvent(dbEvent: IDatabaseEvent): IApiEvent {
	return {
		id: dbEvent.machine_id,
		sub_id: dbEvent.machine_subid,
		timestamp: dbEvent.created_at,
		type: dbEvent.machine_type as any,
		status: dbEvent.machine_status as any,
		comment: dbEvent.comment || undefined,
		game: createApiEventGameFromDatabaseEvent(dbEvent) || undefined,
	};
}

function createApiEventGameFromDatabaseEvent(dbEvent: IDatabaseEvent): IApiEventGame {
	if (dbEvent.game_id || dbEvent.game_name) {
		return {
			id: dbEvent.game_id || undefined,
			name: dbEvent.game_name || undefined,
			players: dbEvent.game_players || undefined,
		};
	} else {
		return null;
	}
}

function createDatabaseEventFromApiEventCreateRequest(request: IApiEventCreateRequest): Partial<IDatabaseEvent> {

	// correction of time (optional with provided local timestamp)
	const correction = request.local_timestamp ? ((new Date(request.local_timestamp)).getTime() - Date.now()) : 0;

	// TODO rely on remote timestamp
	const timestamp = new Date();

	return {
		sandbox: request.sandbox || false,
		created_at: timestamp,
		machine_id: request.id,
		machine_subid: request.sub_id || null,
		machine_type: request.type,
		machine_status: request.status,
		...((request.game && request.status === 'playing') ? {
			game_id: request.game.id || null,
			game_name: request.game.name || null,
			game_players: request.game.players || 1,
		} : {}),
		comment: request.comment || null,
	} as Partial<IDatabaseEvent>
}
