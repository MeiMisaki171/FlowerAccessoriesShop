import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service/prisma.service'; // Import PrismaService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Đọc JWT từ header Authorization
      secretOrKey: process.env.JWT_SECRET || 'namnt123', // Key dùng để giải mã JWT
    });
  }

  async validate(payload: any) {
    // Validate thông tin người dùng trong payload
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user; // Trả về user nếu hợp lệ
  }
}
