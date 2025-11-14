import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name', example: 'Laptop' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'High-performance laptop' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price', example: 999.99, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Stock quantity', example: 50, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ description: 'Product category', example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Product images', example: ['image1.jpg', 'image2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Product active status', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
