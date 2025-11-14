import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getProfile(userId: string): Promise<{ message: string; user: UserDocument }> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'Profile retrieved successfully',
      user,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<{ message: string; user: UserDocument }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete old avatar if new one is uploaded
    if (file && user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const updateData: any = {};
    if (updateProfileDto.name) {
      updateData.name = updateProfileDto.name;
    }
    if (file) {
      updateData.avatar = `uploads/profiles/${file.filename}`;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  async deleteAvatar(userId: string): Promise<{ message: string; user: UserDocument }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.avatar) {
      throw new BadRequestException('No avatar to delete');
    }

    const avatarPath = path.join(process.cwd(), user.avatar);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    user.avatar = undefined;
    await user.save();

    const updatedUser = await this.userModel.findById(userId).select('-password');
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Avatar deleted successfully',
      user: updatedUser,
    };
  }
}
