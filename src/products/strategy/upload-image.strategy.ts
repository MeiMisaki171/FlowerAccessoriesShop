import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads', // Thư mục để lưu ảnh
    filename: (req, file, callback) => {
      const randomName = Math.random().toString(36).substring(2, 15); // Tạo tên ngẫu nhiên cho file
      callback(null, `${randomName}${extname(file.originalname)}`); // Tên file ngẫu nhiên và giữ lại đuôi file gốc
    },
  }),
};
