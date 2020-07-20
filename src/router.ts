import * as KoaRouter from 'koa-router';
import {ApiEventRequestValidator, IApiEventCreateRequest, IApiEventCreateResponse} from './router-io';

export function createEventsRouter(): KoaRouter {
	const router = new KoaRouter();

	router.post('/', async (ctx) => {
		const request: IApiEventCreateRequest = ctx.request.body;
		ctx.assert.ok(ApiEventRequestValidator(request), 400, 'Invalid request', {
			error: 'invalid-request',
			messages: ApiEventRequestValidator.errors,
		});
		const response: IApiEventCreateResponse = null;
		ctx.status = 201;
		ctx.body = response;
	});

	return router;
}
