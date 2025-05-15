import { Body, Controller, Post } from '@nestjs/common';
import { DbhcService } from '../service/dbhc.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DbhcRequestDto } from '../dto/dbhc.request.dto';
import { DbhcResponseDto } from '../dto/dbhc.response.dto';

@ApiTags('Dbhc')
@Controller('dbhc')
export class DbhcController {
  constructor(private readonly dbhcService: DbhcService) {}

  @ApiOperation({ summary: 'Địa bàn hành chính' })
  @Post()
  async getDBHCByLevel(@Body() request: DbhcRequestDto): Promise<DbhcResponseDto[]> {
    return this.dbhcService.getListDbhcByLevel(request);
  }
}
