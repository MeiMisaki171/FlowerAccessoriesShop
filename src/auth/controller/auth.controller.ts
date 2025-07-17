import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register.user.dto';
import { LoginDto } from '../dto/login.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthResponseDto } from '../dto/auth.response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'Người dùng đã đăng ký thành công', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const result = await this.authService.register(dto);
    res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
    return {
      message: 'Đăng ký thành công',
      user: result.user,
      token: result.token,
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'Người dùng đã đăng nhập', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Tài khoản hoặc mật khẩu không chính xác' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
    return {
      message: 'Đăng nhập thành công',
      user: result.user,
      token: result.token,
    };
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Người dùng đã đăng xuất' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    });
    return { message: 'Đăng xuất thành công' };
  }

  // @Post('loout')
  // @UsePipes(new ValidationPipe())
  // @ApiResponse({ status: 200, description: 'User has successfully logged in.' })
  // @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  // async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  //   const result = await this.authService.login(dto);
  //   res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
  //   return { message: 'Login successful' };
  // }

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
