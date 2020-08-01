import {createConnection} from './database';
import * as debug from 'debug';

export const db = createConnection();
export const defaultLogger = debug('app');