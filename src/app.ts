import {db, defaultLogger} from './bootstrap';
import {createApplication, createEventsRouter, createMachinesRouter, createRunsRouter} from './api';
import * as KoaStatic from 'koa-static';
import * as path from 'path';

const logger = defaultLogger.extend('server');
const app = createApplication();
const appPort = process.env.APP_PORT || 8080;

// add static assets
logger('Binding static assets');
app.use(KoaStatic(path.join(__dirname, '../assets/ui'), {index: 'index.html'}));
app.use(KoaStatic(path.join(__dirname, '../assets/meta'), {index: false}));

// add default router
logger('Binding routers');
app.use(createEventsRouter(db).prefix('/').routes());
app.use(createMachinesRouter(db).prefix('/').routes());
app.use(createRunsRouter(db).prefix('/').routes());

const httpServer = app.listen(appPort);
app.on('listening', (addr) => logger('Application started listening %s', appPort));


process.on('SIGTERM', async () => {
	logger('Termination signal received');
	await new Promise((res, rej) => httpServer.close((err) => err ? rej(err) : res()));
	await db.destroy();
})


// get latest events from database

// const detector = new Detector();
// const detectorLogger = debug('detector-processor');
// let doClean = false;
//
// detector.on('start', async (dbEvent: IDatabaseEvent) => {
// 	detectorLogger('Create new GAME RUN');
// 	await db.table('game_runs').insert({
// 		machine_id: dbEvent.machine_id,
// 		machine_type: dbEvent.machine_type,
//
// 		start_at: dbEvent.created_at,
// 		end_at: null,
// 		game_id: dbEvent.game_id,
// 		game_name: dbEvent.game_name,
// 		game_players: dbEvent.game_players || 1,
//
// 		comment: dbEvent.comment,
// 	} as IDatabaseGameRun);
//
// });
//
// async.forever(async (next) => {
//
// 	if (doClean) {
// 		detectorLogger('Cleaning up')
// 		await db.table('machine_events').update({is_dispatched: false});
// 		await db.table('game_runs').delete();
// 		doClean = false;
// 	}
//
// 	try {
//
// 		// get events and put stages
// 		const dbEvents: IDatabaseEvent[] = await db.table('machine_events')
// 			.select('*')
// 			.orderBy('created_at', 'asc')
// 			.where('is_dispatched', false)
// 			.limit(1000);
//
// 		if (!dbEvents.length) {
// 			setTimeout(next, 5000);
// 			return;
// 		}
//
// 		for (const dbEvent of dbEvents) {
// 			detector.receive(dbEvent.machine_id, dbEvent.machine_status, dbEvent.created_at, dbEvent);
// 		}
//
// 		await db.table('machine_events')
// 			.update({is_dispatched: true})
// 			.whereIn('id', dbEvents.map((e) => e.id));
//
// 		return next();
//
// 	} catch (e) {
// 		next(e);
// 	}
//
// }, (err) => {
// 	console.error(err);
// 	process.exit(100);
// });


