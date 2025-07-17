import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ description: 'ID người dùng' })
  id: number;

  @ApiProperty({ description: 'Số điện thoại' })
  phone: string;

  @ApiProperty({ description: 'Email' })
  email?: string;

  @ApiProperty({ description: 'Vai trò' })
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Thông báo kết quả' })
  message: string;

  @ApiProperty({ description: 'Thông tin người dùng', type: UserInfoDto })
  user: UserInfoDto;

  @ApiProperty({ description: 'Token' })
  token: string;
}
