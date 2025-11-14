import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Laptop' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'High-performance laptop' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product price', example: 999.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock quantity', example: 50, minimum: 0 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ description: 'Product category', example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Product images', example: ['image1.jpg', 'image2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
