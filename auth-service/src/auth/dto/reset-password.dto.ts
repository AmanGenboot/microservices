import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code sent to email',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
