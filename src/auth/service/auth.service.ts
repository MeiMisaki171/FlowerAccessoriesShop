import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../dto/register.user.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    try {
      // Kiểm tra sự tồn tại của phone, username hoặc email trong một lần truy vấn duy nhất
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ phone: dto.phone }, { username: dto.username }, { email: dto.email }],
        },
      });

      if (existingUser) {
        // Lỗi nếu tìm thấy người dùng đã tồn tại
        const field =
          existingUser.phone === dto.phone
            ? 'Số điện thoại'
            : existingUser.username === dto.username
              ? 'Tên người dùng'
              : 'Email';

        throw new BadRequestException(`${field} đã tồn tại.`);
      }

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          username: dto.username,
          fullName: dto.fullName,
          password: hashed,
          provider: 'local',
        },
      });

      return this.generateToken(user);
    } catch (error) {
      console.error('Error in register():', error);

      // Xử lý lỗi: nếu lỗi là Prisma Client hoặc không phải lỗi mà bạn đã xử lý, ném lại lỗi chung
      if (error instanceof BadRequestException) {
        throw error; // Đã xử lý lỗi ở trên, chỉ ném ra lỗi đó
      }

      throw new InternalServerErrorException('Đăng ký thất bại: ' + error.message);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: dto.login }, { username: dto.login }],
        provider: 'local',
      },
    });

    if (!user || !user.password || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }

    return this.generateToken(user);
  }

  // async loginWithFacebook(email: string, fullName: string) {
  //   // Kiểm tra người dùng đã tồn tại chưa
  //   let user = await this.prisma.user.findUnique({ where: { email } });

  //   if (!user) {
  //     // Nếu không tìm thấy người dùng, tạo mới
  //     user = await this.prisma.user.create({
  //       data: {
  //         email,
  //         fullName,
  //         provider: 'facebook', // Đánh dấu người dùng đăng nhập bằng Facebook
  //         username: `facebook_${Date.now()}`, // Tạo tên người dùng tạm
  //         phone: '0000000000', // Điền giá trị mặc định nếu không có phone
  //       },
  //     });
  //   }

  //   // Tạo JWT token
  //   const payload = { sub: user.id, email: user.email, fullName: user.fullName, provider: user.provider };
  //   const token = this.jwtService.sign(payload);

  //   return { access_token: token }; // Trả về token cho người dùng
  // }

  // async loginWithGoogle(email: string, fullName: string) {
  //   let user = await this.prisma.user.findUnique({ where: { email } });

  //   if (!user) {
  //     user = await this.prisma.user.create({
  //       data: {
  //         email,
  //         fullName,
  //         provider: 'google',
  //         username: 'google_' + Date.now(),
  //         phone: '0000000000', // Tạm thời để default
  //       },
  //     });
  //   }

  //   return this.generateToken(user);
  // }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
