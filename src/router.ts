import * as KoaRouter from 'koa-router';
import {ApiEventRequestValidator, IApiEvent, IApiEventCreateRequest, IApiEventCreateResponse, IApiEventsResponse} from './router-io';

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


	// GET runs (take data from DB and show it)
	router.get('/runs', (ctx) => {
		ctx.body = [];
	});

	return router;
}
