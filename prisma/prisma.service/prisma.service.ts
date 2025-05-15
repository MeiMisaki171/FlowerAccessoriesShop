// src/prisma/prisma.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { cartMiddleware } from '../../prisma/prisma.middleware/prisma.middleware';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();

    this.$use(cartMiddleware(this));
  }

  async onModuleInit() {
    await this.$connect();
  }
}
