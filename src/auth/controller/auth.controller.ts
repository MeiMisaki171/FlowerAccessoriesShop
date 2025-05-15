import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register.user.dto';
import { LoginDto } from '../dto/login.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User has been successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User has successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleLogin(@Req() req) {}
  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   console.log(req.user);
  //   return this.authService.loginWithGoogle(req.user.email, req.user.fullName);
  // }

  // @Get('facebook')
  // async facebookLogin(@Req() req) {
  //   // Facebook callback sẽ gọi đây và người dùng sẽ được đăng nhập.
  //   return this.authService.loginWithFacebook(req.user.email, req.user.fullName);
  // }
}
