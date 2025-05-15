import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../service/order.service';
import { OrderDto } from '../dto/order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng' })
  async findById(@Param('id') id: string) {
    return this.orderService.fillOne(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin tất cả đơn hàng' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Thêm mới đơn hàng' })
  async create(@Body() data: OrderDto): Promise<OrderDto> {
    return this.orderService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Chỉnh sửa đơn hàng' })
  async update(@Param('id') id: string, @Body() data: OrderDto) {
    return this.orderService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đơn hàng - Hủy đơn hoặc giao hàng thành công' })
  async delete(@Param('id') id: string) {
    return this.orderService.delete(+id);
  }
}
