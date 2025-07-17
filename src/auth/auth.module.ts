import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { PrismaModule } from 'prisma/prisma.module/prisma.module';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
// import { FacebookStrategy } from './strategy/facebook.strategy';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtAuthGuard, RefreshTokenGuard],
  exports: [AuthService, RefreshTokenGuard, JwtModule],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Đặt secret key cho JWT
      signOptions: { expiresIn: '24h' }, // Đặt thời gian hết hạn token
    }),
  ],
})
export class AuthModule {}
