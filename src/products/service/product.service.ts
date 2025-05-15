import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service/prisma.service';
import { ProductResponseDto } from '../dto/product.response.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product, ProductImage } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByCategory(categoryId: number): Promise<ProductResponseDto[]> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Danh mục sản phẩm không tồn tại`);
    }

    return this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
        images: {
          where: {
            isCover: true,
          },
        },
      },
    });
  }

  async getAll(): Promise<ProductResponseDto[]> {
    return this.prisma.product.findMany({
      include: {
        category: true,
        images: {
          where: {
            isCover: true,
          },
        },
      },
    });
  }

  async findBySearch(query: string | null): Promise<ProductResponseDto[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query || '',
            },
          },
          {
            description: {
              contains: query || '',
            },
          },
        ],
      },
      include: {
        category: true,
        images: {
          where: { isCover: true },
        },
      },
    });
  }

  async findById(id: number): Promise<ProductResponseDto | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    try {
      // Kiểm tra danh mục sản phẩm
      const category = await this.prisma.category.findUnique({
        where: { id: +data.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Danh mục sản phẩm không tồn tại');
      }

      // Tạo sản phẩm mới mà không có ảnh
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          categoryId: data.categoryId ? Number(data.categoryId) : null,
        },
        include: {
          category: true,
          images: true, // Lấy thông tin ảnh liên quan đến sản phẩm
        },
      });

      // Xử lý ảnh nếu có
      if (data.images && data.images.length > 0) {
        const imageUrls: ProductImage[] = [];

        // Lưu URL của từng ảnh vào bảng ProductImage
        for (const imageUrl of data.images) {
          const image = await this.prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl: imageUrl,
              isCover: false, // Mặc định không phải ảnh bìa
            },
          });

          imageUrls.push(image);
        }

        // Cập nhật sản phẩm với các ảnh đã upload
        product.images = imageUrls;
      }

      return product;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Lỗi khi tạo sản phẩm:', error);
      throw new InternalServerErrorException('Lỗi khi tạo sản phẩm, vui lòng thử lại sau');
    }
  }

  async update(id: number, data: UpdateProductDto): Promise<ProductResponseDto> {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Cập nhật thông tin sản phẩm
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
        images: true, // Lấy thông tin ảnh liên quan đến sản phẩm
      },
    });

    // Xử lý ảnh nếu có
    if (data.images && data.images.length > 0) {
      // Xóa ảnh cũ nếu có
      await this.prisma.productImage.deleteMany({
        where: {
          productId: updatedProduct.id,
        },
      });

      const imageUrls: ProductImage[] = [];

      // Lưu URL của từng ảnh mới vào bảng ProductImage
      for (const imageUrl of data.images) {
        const image = await this.prisma.productImage.create({
          data: {
            productId: updatedProduct.id,
            imageUrl: imageUrl,
            isCover: false, // Mặc định không phải ảnh bìa
          },
        });

        imageUrls.push(image);
      }

      // Cập nhật lại thông tin ảnh cho sản phẩm
      updatedProduct.images = imageUrls;
    }

    return updatedProduct;
  }

  async delete(id: number): Promise<{ message: string }> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: `Xóa sản phẩm thành công` };
  }
}
