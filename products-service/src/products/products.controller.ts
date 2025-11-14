import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    // In a real application, you would get userId from JWT token
    // For now, you can pass it in request or set a default
    const userId = req.userId || req.body.userId || 'default-user-id';
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter products by user ID' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query('userId') userId?: string) {
    return this.productsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your product' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    // In a real application, you would get userId from JWT token
    const userId = req.userId || req.body.userId || 'default-user-id';
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your product' })
  async remove(@Param('id') id: string, @Request() req) {
    // In a real application, you would get userId from JWT token
    const userId = req.userId || req.body.userId || 'default-user-id';
    return this.productsService.remove(id, userId);
  }
}
