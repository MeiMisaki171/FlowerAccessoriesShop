import { PrismaClient } from '@prisma/client';
import { Prisma } from 'prisma/app/generated/prisma/client';

export function cartMiddleware(prisma: PrismaClient): Prisma.Middleware {
  return async (params, next) => {
    const result = await next(params);

    if (params.model === 'User' && params.action === 'create') {
      await prisma.cart.create({
        data: { userId: result.id },
      });
    }

    return result;
  };
}
