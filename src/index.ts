import dotenv from 'dotenv';

import { App } from './server';

dotenv.config();

const {
  HOST: host,
  PORT: port,
} = process.env;
const app = new App({
  host,
  port,
});

app.startServer();

process.on('SIGTERM', app.exit);
