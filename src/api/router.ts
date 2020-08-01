// import * as KoaRouter from 'koa-router';
// import {
// 	ApiEventRequestValidator, ApiRunsRequestQueryValidator,
// 	IApiEvent,
// 	IApiEventCreateRequest,
// 	IApiEventCreateResponse,
// 	IApiEventsResponse,
// 	IApiRun, IApiRunsRequestQuery,
// 	IApiRunsResponse
// } from './router-io';
// import * as util from 'util';
// import {DatabaseConnection, IDatabaseEvent, IDatabaseGameRun} from '../database';
//
// export function createEventsRouter(db: DatabaseConnection): KoaRouter {
// 	const router = new KoaRouter();
//
// 	// Get latest 100 events
// 	router.get('/events', async (ctx) => {
// 		const events = await db.table<IDatabaseEvent>('machine_events')
// 			.select('*')
// 			.orderBy('created_at', 'desc')
// 			.limit(100);
// 		const response: IApiEventsResponse = events.map(createApiEvent);
// 		ctx.status = 200;
// 		ctx.body = response;
// 	});
//
// 	router.post('/events', async (ctx) => {
// 		const request: IApiEventCreateRequest = ctx.request.body;
// 		ctx.assert.ok(ApiEventRequestValidator(request), 400, 'Invalid request', {
// 			error: 'invalid-request',
// 			messages: ApiEventRequestValidator.errors,
// 		});
//
// 		const inserts: IDatabaseEvent[] = await db.table('machine_events')
// 			.returning('*')
// 			.insert({
// 				machine_id: request.id,
// 				machine_type: request.type,
// 				machine_status: request.status,
// 				...((request.game && request.status === 'playing') ? {
// 					game_id: request.game.id || null,
// 					game_name: request.game.name || null,
// 					game_players: request.game.players || 1,
// 				} : {}),
// 				comment: request.comment || null,
// 			} as Partial<IDatabaseEvent>);
//
// 		const response: IApiEventCreateResponse = createApiEvent(inserts[0]);
// 		ctx.status = 201;
// 		ctx.body = response;
// 	});
//
//
// 	// GET runs (take data from DB and show it)
// 	router.get('/runs', async (ctx) => {
// 		const requestQuery: IApiRunsRequestQuery = ctx.request.query;
// 		ctx.assert.ok(ApiRunsRequestQueryValidator(requestQuery), 400, 'Invalid request', {
// 			error: 'invalid-request',
// 			messages: ApiEventRequestValidator.errors,
// 		});
//
// 		const {o: offset, l: limit, from, to} = {o: 0, l: 100, ...requestQuery};
// 		const timeFrom = requestQuery.from ? new Date(requestQuery.from) : null;
// 		const timeTo = requestQuery.to ? new Date(requestQuery.to) : null;
//
// 		const queryBuilder = db.table('game_runs')
//
// 		// apply filters
// 		if (timeFrom) {
// 			queryBuilder.where('start_at < ?', timeFrom);
// 		}
//
// 		if (timeTo) {
// 			queryBuilder.where('start_at > ?', timeTo);
// 		}
//
// 		const total = parseInt((await queryBuilder.clone().count('id').first() as any).count, 10);
//
// 		let gameRuns: IDatabaseGameRun[];
//
// 		switch (ctx.accepts('json', 'csv')) {
// 			case 'csv':
// 				gameRuns = await queryBuilder.clone()
// 					.orderBy('created_at', 'desc');
//
// 				// make formatting for CSV
// 				ctx.type = 'text/csv';
// 				ctx.set('Content-Disposition', util.format('attachment; filename=%s', 'runs.csv'));
// 				ctx.body = gameRuns
// 					.map((gameRun) => [
// 						gameRun.machine_id,
// 						gameRun.machine_type,
// 						gameRun.start_at ? gameRun.start_at.toISOString() : null,
// 						gameRun.end_at ? gameRun.end_at.toISOString() : null,
// 						gameRun.comment,
// 						gameRun.game_id,
// 						gameRun.game_name,
// 						gameRun.game_players,
// 					])
// 					.map((a) => a.join(', '))
// 					.join('\r\n');
// 				break;
//
// 			default:
// 				gameRuns = await queryBuilder.clone()
// 					.orderBy('created_at', 'asc')
// 					.limit(limit).offset(offset);
//
// 				// make formatting for JSON
// 				ctx.set('X-Total-Count', total.toString(10));
// 				ctx.set('Content-Range', util.format('items %d-%d/%d', offset, offset + gameRuns.length, total));
// 				ctx.status = 200;
// 				ctx.body = gameRuns.map((gameRun): IApiRun => ({
// 					id: gameRun.machine_id,
// 					type: gameRun.machine_type as any,
// 					start_at: gameRun.start_at,
// 					end_at: gameRun.end_at,
// 					location: gameRun.comment,
// 					game: {
// 						id: gameRun.game_id,
// 						name: gameRun.game_name,
// 						players: gameRun.game_players,
// 					}
// 				})) as IApiRunsResponse;
// 				break;
// 		}
//
// 	});
//
// 	return router;
// }
//
//
// function createApiEvent(dbEvent: IDatabaseEvent): IApiEvent {
// 	return {
// 		id: dbEvent.machine_id,
// 		timestamp: dbEvent.created_at,
// 		local_timestamp: dbEvent.created_at,
// 		type: dbEvent.machine_type as any,
// 		status: dbEvent.machine_status as any,
// 		comment: dbEvent.comment || undefined,
// 		game: (dbEvent.game_id || dbEvent.game_name) ? {
// 			id: dbEvent.game_id || undefined,
// 			name: dbEvent.game_name || undefined,
// 			players: dbEvent.game_players || undefined,
// 		} : undefined
// 	};
// }
