import * as Koa from 'koa';
import * as KoaCors from '@koa/cors';
import * as KoaBodyParser from 'koa-bodyparser';
import * as KoaJsonError from 'koa-json-error';

export function createApplication(): Koa {
	const app = new Koa();

	// add body parser
	app.use(KoaBodyParser({}));

	// use cors
	app.use(KoaCors({
		allowHeaders: '*',
		exposeHeaders: '*',
	}));

	// error handler for http responses
	// app.use(async (ctx, next) => {
	// 	try {
	// 		await next();
	// 	} catch (err) {
	// 		// tslint:disable-next-line:no-console
	// 		console.error(err.message, err.name);
	// 		throw err;
	// 	}
	// });

	app.use(KoaJsonError());


	// TODO add cross-origin

	return app;
}


