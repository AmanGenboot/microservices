import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { multerConfig } from './config/multer.config';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Put()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @ApiOperation({ summary: 'Update user profile with optional image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file (jpg, jpeg, png, gif)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file type or data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(
      req.user.userId,
      updateProfileDto,
      file,
    );
  }

  @Delete('avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar deleted successfully' })
  @ApiResponse({ status: 400, description: 'No avatar to delete' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAvatar(@Request() req) {
    return this.profileService.deleteAvatar(req.user.userId);
  }
}
