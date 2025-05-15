import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/product.service';
import { ProductResponseDto } from '../dto/product.response.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../roles.guard';
import { Roles } from '../../roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../strategy/upload-image.strategy';
import { ImageService } from '../../image/service/image.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imageService: ImageService,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Tên sản phẩm',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy sản phẩm',
  })
  async findBySearch(@Query('query') query: string | null) {
    return this.productsService.findBySearch(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductResponseDto,
  })
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm theo danh mục' })
  @ApiResponse({
    status: 200,
    description: 'ID danh mục',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục',
  })
  async getAllByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.getAllByCategory(categoryId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'ID danh mục',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục',
  })
  async getAll() {
    return this.productsService.getAll();
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: ProductResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], multerOptions))
  async create(
    @Body() data: CreateProductDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ): Promise<ProductResponseDto> {
    const imageUrls = files?.images?.map((file) => `/uploads/${file.filename}`) || [];
    data.images = imageUrls;
    const product = await this.productsService.create(data);

    this.imageService.cleanUnusedImages().catch((err) => console.error('Image cleanup failed:', err));

    return product;
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ): Promise<ProductResponseDto> {
    const imageUrls = files.images.map((file) => `/uploads/${file.filename}`);
    data.images = imageUrls;
    return this.productsService.update(+id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Xoá sản phẩm' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.delete(+id);
  }
}
