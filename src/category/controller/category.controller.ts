import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../service/category.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryResponseDto } from '../dto/category.response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../roles.guard';
import { Roles } from '../../roles.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Danh mục sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục',
    type: CategoryResponseDto,
    isArray: true,
  })
  async getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Thêm mới danh mục' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: CategoryResponseDto })
  async create(@Body() data: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(data);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  async update(@Param('id') id: string, @Body() data: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(+id, data);
  }

  @Delete('id')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.delete(+id);
  }
}
