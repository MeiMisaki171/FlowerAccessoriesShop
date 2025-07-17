import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies['jwt'];

    if (!token) {
      throw new UnauthorizedException('Không tìm thấy token');
    }

    try {
      // Verify token
      const payload = await this.jwtService.verifyAsync(token);

      console.log(payload);

      // Kiểm tra thời gian hết hạn của token
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Nếu token còn hơn 1 giờ nữa mới hết hạn, không cần refresh
      if (timeUntilExpiry > 3600000) {
        // 1 hour in milliseconds
        request['user'] = payload;
        return true;
      }

      // Nếu token sắp hết hạn (còn dưới 1 giờ), refresh token
      const { token: newToken, cookie } = await this.authService.refreshToken(payload);

      // Cập nhật cookie mới
      response.cookie(cookie.name, cookie.value, cookie.options);

      // Cập nhật user trong request
      request['user'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
