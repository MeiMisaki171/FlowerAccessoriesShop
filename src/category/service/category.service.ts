import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service/prisma.service';
import { CategoryResponseDto } from '../dto/category.response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategory(): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId ?? null,
      },
      include: {
        parent: true,
      },
    });
  }

  async updateCategory(id: number, data: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId ?? null,
      },
      include: {
        parent: true,
      },
    });
  }

  async delete(id: number): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }

    if (category.children.length > 0) {
      throw new NotFoundException(`Không thể xóa danh mục có danh mục con`);
    }

    await this.prisma.category.delete({ where: { id } });

    return { message: 'Xóa danh mục thành công' };
  }
}
