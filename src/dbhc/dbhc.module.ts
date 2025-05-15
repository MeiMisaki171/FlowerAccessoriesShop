import { Module } from '@nestjs/common';
import { DbhcController } from './controller/dbhc.controller';
import { PrismaModule } from '../../prisma/prisma.module/prisma.module';
import { PrismaService } from '../../prisma/prisma.service/prisma.service';
import { DbhcService } from './service/dbhc.service';

@Module({
  controllers: [DbhcController],
  providers: [DbhcService, PrismaService],
  imports: [PrismaModule],
  exports: [DbhcService],
})
export class DbhcModule {}
