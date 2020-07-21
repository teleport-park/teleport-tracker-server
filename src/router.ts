import * as KoaRouter from 'koa-router';
import * as faker from 'faker';
import {
	ApiEventRequestValidator, ApiRunsRequestQueryValidator,
	IApiEvent,
	IApiEventCreateRequest,
	IApiEventCreateResponse,
	IApiEventsResponse,
	IApiGame, IApiRun, IApiRunsRequestQuery,
	IApiRunsResponse
} from './router-io';
import * as util from 'util';

export function createEventsRouter(): KoaRouter {
	const router = new KoaRouter();

	const eventsList: IApiEvent[] = [];

	router.get('/events', async (ctx) => {
		// const requestQuery;
		const response: IApiEventsResponse = [...eventsList];
		ctx.status = 200;
		ctx.body = response;
	});

	router.post('/events', async (ctx) => {
		const request: IApiEventCreateRequest = ctx.request.body;

		console.log(request);

		ctx.assert.ok(ApiEventRequestValidator(request), 400, 'Invalid request', {
			error: 'invalid-request',
			messages: ApiEventRequestValidator.errors,
		});

		// TODO process event here
		const event: IApiEvent = {
			...request,
			timestamp: new Date(),
		}
		eventsList.push(event);

		const response: IApiEventCreateResponse = event;
		ctx.status = 201;
		ctx.body = response;
	});


	const gameDir: IApiRun[] = (new Array(250)).fill(0).map(() => {
		const start = faker.date.recent(5);
		return {
			id: faker.random.uuid(),
			type: faker.random.arrayElement(['tvr', 'tng', 'tpg']),
			location: faker.address.city(),
			start_at: start,
			end_at: start,
			game: {
				id: faker.random.uuid(),
				name: 'Some game',
			},
		}
	});


	// GET runs (take data from DB and show it)
	router.get('/runs', (ctx) => {
		const requestQuery: IApiRunsRequestQuery = ctx.request.query;
		ctx.assert.ok(ApiRunsRequestQueryValidator(requestQuery), 400, 'Invalid request', {
			error: 'invalid-request',
			messages: ApiEventRequestValidator.errors,
		});

		const {o: offset, l: limit} = {o: 0, l: 100, ...requestQuery};
		const total = gameDir.length;

		const response: IApiRunsResponse = gameDir.slice(offset, offset + limit);

		ctx.set('X-Total-Count', total.toString(10));
		ctx.set('Content-Range', util.format('items %d-%d/%d', offset, Math.min(offset + limit, total), total));
		ctx.status = 200;
		ctx.body = response;
	});

	return router;
}
