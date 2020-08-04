import {DatabaseConnection, IDatabaseGameRun} from '../database';
import * as KoaRouter from 'koa-router';
import * as Router from 'koa-router';
import {ApiRunsRequestQueryValidator, IApiRunsRequestQuery, IApiRunsResponse} from './runs-io';
import {ApiEventRequestValidator} from './events-io';
import * as util from 'util';

export function createRunsRouter(db: DatabaseConnection): KoaRouter {

	const router = new Router();


	async function getRuns(timeFrom?: Date, timeTo?: Date, limit?: number, offset?: number): Promise<[any[], number]> {
		const baseBuilder = db.table<IDatabaseGameRun>('game_runs')
		if (timeFrom) {
			baseBuilder.where('start_at', '>', timeFrom);
		}
		if (timeTo) {
			baseBuilder.where('start_at', '<', timeTo);
		}

		const totalBuilder = baseBuilder.clone().clearSelect().count('id').first();
		const resultsBuilder = baseBuilder.clone()
			.leftJoin(db.raw('machines ON game_runs.machine_id = machines.id'))
			.select(['game_runs.*', 'machines.machine_type', 'machines.location_name', 'machines.machine_id'])
			.orderBy('start_at', 'asc');

		if (limit) {
			resultsBuilder.limit(limit);
		}
		if (offset) {
			resultsBuilder.offset(offset);
		}

		const total = parseInt((await totalBuilder as any).count, 10);
		const gameRuns = await resultsBuilder;
		return [gameRuns, total];
	}

	router.get('/runs', async (ctx) => {

		const requestQuery: IApiRunsRequestQuery = ctx.request.query;
		ctx.assert.ok(ApiRunsRequestQueryValidator(requestQuery), 400, 'Invalid request', {
			error: 'invalid-request',
			messages: ApiEventRequestValidator.errors,
		});

		const {o: offset, l: limit, from, to} = {o: 0, l: 100, ...requestQuery};
		const timeFrom = requestQuery.from ? new Date(requestQuery.from) : null;
		const timeTo = requestQuery.to ? new Date(requestQuery.to) : null;

		const [gameRuns, total] = await getRuns(timeFrom, timeTo, limit, offset);

		const response: IApiRunsResponse = gameRuns.map((gameRun) => ({
			id: gameRun.machine_id,
			type: gameRun.machine_type as any,
			start_at: gameRun.start_at,
			end_at: gameRun.end_at,
			location: gameRun.location_name,
			comment: gameRun.comment,
			game: {
				id: gameRun.game_id,
				name: gameRun.game_name,
				players: gameRun.game_players,
			}
		}));

		ctx.set('X-Total-Count', total.toString(10));
		ctx.set('Content-Range', util.format('items %d-%d/%d', offset, offset + gameRuns.length, total));
		ctx.body = response;
		ctx.status = 200;
	});

	router.get('/runs/export', async (ctx) => {

		const requestQuery: IApiRunsRequestQuery = ctx.request.query;
		ctx.assert.ok(ApiRunsRequestQueryValidator(requestQuery), 400, 'Invalid request', {
			error: 'invalid-request',
			messages: ApiEventRequestValidator.errors,
		});

		const timeFrom = requestQuery.from ? new Date(requestQuery.from) : null;
		const timeTo = requestQuery.to ? new Date(requestQuery.to) : null;
		const [gameRuns, total] = await getRuns(timeFrom, timeTo);

		// make formatting for CSV
		ctx.type = 'text/csv';
		ctx.set('Content-Disposition', util.format('attachment; filename=%s', 'runs.csv'));
		ctx.body = gameRuns
			.map((gameRun) => [
				gameRun.machine_id,
				gameRun.machine_type,
				gameRun.start_at ? gameRun.start_at.toISOString() : null,
				gameRun.end_at ? gameRun.end_at.toISOString() : null,
				gameRun.location,
				gameRun.comment,
				gameRun.game_id,
				gameRun.game_name,
				gameRun.game_players,
			])
			.map((a) => a.join(', '))
			.join('\r\n');


		ctx.status = 200;
	});

	return router;
}


