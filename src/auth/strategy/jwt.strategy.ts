import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service/prisma.service'; // Import PrismaService
import { UserInfoDto } from '../dto/auth.response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.jwt;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || '123', // Key dùng để giải mã JWT
    });
  }

  async validate(payload: any): Promise<UserInfoDto> {
    // Validate thông tin người dùng trong payload
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    return {
      id: user.id,
      phone: user.phone,
      email: user.email || undefined,
      role: user.role,
    };
  }
}
