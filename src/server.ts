import fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

import { rootRouteHandlerFactory } from './routes/root';

export class App {
  server: FastifyInstance
  host: string
  port: number


  constructor({ host, port }) {
    const server = fastify({ logger: true });

    this.server = server;
    this.host = host;
    this.port = port;

    this.init();
  }

  async init() {
    this.server.register(fastifyStatic, {
      root: process.env.PUBLIC_DIR || path.join(__dirname, '/public'),
      prefix: '/public',
    });

    this.server.get('/*', await rootRouteHandlerFactory());
  }

  async startServer() {
    const { port, server, host } = this
    try {
      await server.listen({
        host,
        port,
      })
    } catch (error) {
      server.log.error(error)
      process.exit(1)
    }
  }

  // Exit gracefully
  // Useful to reduce docker-compose down time
  async exit() {
    const { server } = this;

    try {
      await server.close();
      server.log.info('Shutting down server!');
    } catch(error) {
      server.log.error('An error happened', error);
    }
  }
}
