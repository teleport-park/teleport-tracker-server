import * as Koa from 'koa';
import * as KoaBodyParser from 'koa-bodyparser';

export function createApplication(): Koa {
	const app = new Koa();

	// add body parser
	app.use(KoaBodyParser({}));

	// TODO add cross-origin

	return app;
}


