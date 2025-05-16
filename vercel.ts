import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { createServer, Server } from 'http';
import { AppModule } from './src/app.module';
let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  const expressApp = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();

  return createServer(expressApp); // ✅ FIX: wrap Express app in HTTP server
}

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  cachedServer.emit('request', req, res);
}
