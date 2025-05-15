import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { PrismaModule } from 'prisma/prisma.module/prisma.module';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { FacebookStrategy } from './strategy/facebook.strategy';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'namnt123', // Đặt secret key cho JWT
      signOptions: { expiresIn: '1h' }, // Đặt thời gian hết hạn token
    }),
  ],
})
export class AuthModule {}
