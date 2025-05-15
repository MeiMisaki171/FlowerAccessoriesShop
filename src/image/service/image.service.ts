import { Injectable } from '@nestjs/common';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service/prisma.service';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async cleanUnusedImages() {
    try {
      const allFiles = await readdir(UPLOADS_DIR);

      const allImagePathsInDb = await this.prisma.productImage.findMany({
        select: {
          imageUrl: true,
        },
      });

      const usedFiles = allImagePathsInDb
        .flatMap((productImage) => productImage.imageUrl || [])
        .map((imgUrl) => imgUrl.replace('/uploads/', ''));

      const unusedFiles = allFiles.filter((file) => !usedFiles.includes(file));

      for (const file of unusedFiles) {
        const filePath = join(UPLOADS_DIR, file);
        await unlink(filePath);
        console.log(`Đã xóa: ${file}`);
      }

      console.log('Dọn dẹp xong');
    } catch (error) {
      console.error('Lỗi khi dọn dẹp ảnh:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async afterImageUpload() {
    await this.cleanUnusedImages(); // Gọi hàm dọn dẹp sau khi tải ảnh lên
  }
}
