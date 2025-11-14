"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../auth/schemas/user.schema");
const fs = require("fs");
const path = require("path");
let ProfileService = class ProfileService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'Profile retrieved successfully',
            user,
        };
    }
    async updateProfile(userId, updateProfileDto, file) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (file && user.avatar) {
            const oldAvatarPath = path.join(process.cwd(), user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }
        const updateData = {};
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
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'Profile updated successfully',
            user: updatedUser,
        };
    }
    async deleteAvatar(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.avatar) {
            throw new common_1.BadRequestException('No avatar to delete');
        }
        const avatarPath = path.join(process.cwd(), user.avatar);
        if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
        }
        user.avatar = undefined;
        await user.save();
        const updatedUser = await this.userModel.findById(userId).select('-password');
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'Avatar deleted successfully',
            user: updatedUser,
        };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProfileService);
//# sourceMappingURL=profile.service.js.map