import {createApplication} from './app';
import {createEventsRouter} from './router';
import * as KoaStatic from 'koa-static';
import * as path from 'path';

const app = createApplication();

// add static assets
app.use(KoaStatic(path.join(__dirname, '../assets/ui'), {index: 'index.html'}));
app.use(KoaStatic(path.join(__dirname, '../assets/meta'), {index: false}));

app.use(createEventsRouter().prefix('/').routes());

app.listen(process.env.APP_PORT || 8080);
