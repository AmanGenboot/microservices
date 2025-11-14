import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, description: 'Profile image file' })
  @IsOptional()
  avatar?: string;
}
