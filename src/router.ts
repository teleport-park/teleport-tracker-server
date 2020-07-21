import * as KoaRouter from 'koa-router';
import * as faker from 'faker';
import {
	ApiEventRequestValidator, ApiRunsRequestQueryValidator,
	IApiEvent,
	IApiEventCreateRequest,
	IApiEventCreateResponse,
	IApiEventsResponse,
	IApiRun, IApiRunsRequestQuery,
	IApiRunsResponse
} from './router-io';
import * as util from 'util';

export function createEventsRouter(): KoaRouter {
	const router = new KoaRouter();

	const eventsList: IApiEvent[] = [];

	router.get('/events', async (ctx) => {
		// const requestQuery;
		const response: IApiEventsResponse = [...eventsList].reverse();
		ctx.status = 200;
		ctx.body = response;
	});

	router.post('/events', async (ctx) => {
		const request: IApiEventCreateRequest = ctx.request.body;
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

		if (eventsList.length > 1000) {
			eventsList.shift();
		}

		const response: IApiEventCreateResponse = event;
		ctx.status = 201;
		ctx.body = response;
	});


	const gameDir: IApiRun[] = (new Array(1500)).fill(0).map(() => {
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

		const {o: offset, l: limit, from, to} = {o: 0, l: 100, ...requestQuery};
		const timeStart = requestQuery.from ? new Date(requestQuery.from) : null;
		const timeEnd = requestQuery.to ? new Date(requestQuery.to) : null;

		const runs: IApiRunsResponse = gameDir.filter((run) => {
			if (timeStart && run.start_at.getTime() < timeStart.getTime()) {
				return false;
			} else if (timeEnd && run.start_at.getTime() > timeEnd.getTime()) {
				return false;
			}
			return true;
		});

		const response = runs.slice(offset, offset + limit);
		const total = runs.length;

		ctx.set('X-Total-Count', total.toString(10));
		ctx.set('Content-Range', util.format('items %d-%d/%d', offset, offset + response.length, total));
		ctx.status = 200;

		switch (ctx.accepts('csv', 'json')) {
			case 'csv':
				// make formatting for CSV
				ctx.type = 'text/csv';
				ctx.set('Content-Disposition', util.format('attachment; filename=%s', 'runs.csv'));
				ctx.body = response.map((i) => Object.values(i)).join('\r\n');
				break;
			default:
				ctx.body = response;
				break;
		}

	});

	return router;
}
