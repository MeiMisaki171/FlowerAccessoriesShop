import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service/prisma.service';
import { DbhcRequestDto } from '../dto/dbhc.request.dto';
import { DbhcResponseDto } from '../dto/dbhc.response.dto';

@Injectable()
export class DbhcService {
  constructor(private readonly prisma: PrismaService) {}

  async getListDbhcByLevel(request: DbhcRequestDto): Promise<DbhcResponseDto[]> {
    if (request.level == 1) {
      const results = await this.prisma.dbhc.findMany({
        where: {
          MA_CHA: null,
        },
      });

      return results.map((item) => ({ ...item, level: 1 }));
    }

    if (request.level == 2) {
      let parentCodes: string[] = [];

      if (request.MA_CHA) {
        parentCodes = [request.MA_CHA];
      } else {
        const level1 = await this.prisma.dbhc.findMany({
          where: { MA_CHA: null },
          select: { MA_DBHC: true },
        });
        parentCodes = level1.map((item) => item.MA_DBHC!).filter(Boolean);
      }

      const results = await this.prisma.dbhc.findMany({
        where: {
          MA_CHA: {
            in: parentCodes,
          },
        },
      });

      return results.map((item) => ({ ...item, level: 2 }));
    }
    if (request.level === 3) {
      let parentCodes: string[] = [];

      if (request.MA_CHA) {
        parentCodes = [request.MA_CHA];
      } else {
        const level1 = await this.prisma.dbhc.findMany({
          where: { MA_CHA: null },
          select: { MA_DBHC: true },
        });
        const cap1Codes = level1.map((i) => i.MA_DBHC!).filter(Boolean);

        const level2 = await this.prisma.dbhc.findMany({
          where: {
            MA_CHA: { in: cap1Codes },
          },
          select: { MA_DBHC: true },
        });

        parentCodes = level2.map((i) => i.MA_DBHC!).filter(Boolean);
      }

      const results = await this.prisma.dbhc.findMany({
        where: {
          MA_CHA: { in: parentCodes },
        },
      });

      return results.map((item) => ({ ...item, level: 3 }));
    }
    return [];
  }
}
