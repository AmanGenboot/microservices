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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
const auth_enum_1 = require("../common/enums/auth.enum");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.BCRYPT_SALT_ROUNDS = 10;
        this.HARDCODED_OTP = '123456';
        this.OTP_EXPIRY_MINUTES = 10;
    }
    async register(registerDto) {
        const { email, password, name } = registerDto;
        await this.checkUserExists(email);
        const hashedPassword = await this.hashPassword(password);
        const user = await this.userModel.create({
            email,
            password: hashedPassword,
            name,
        });
        return {
            message: auth_enum_1.AuthMessage.USER_REGISTERED,
            user: this.sanitizeUser(user),
        };
    }
    async checkUserExists(email) {
        const existingUser = await this.userModel.findOne({ email }).lean();
        if (existingUser) {
            throw new common_1.ConflictException(auth_enum_1.AuthMessage.USER_ALREADY_EXISTS);
        }
    }
    async hashPassword(password) {
        return bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    sanitizeUser(user) {
        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            ...(user.avatar && { avatar: user.avatar }),
            ...(user.provider && { provider: user.provider }),
        };
    }
    generateToken(user) {
        const payload = { email: user.email, sub: user._id };
        return this.jwtService.sign(payload);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException(auth_enum_1.AuthMessage.INVALID_CREDENTIALS);
        }
        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException(auth_enum_1.AuthMessage.INVALID_CREDENTIALS);
        }
        return {
            accessToken: this.generateToken(user),
            user: this.sanitizeUser(user),
        };
    }
    async validateUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException(auth_enum_1.AuthMessage.USER_NOT_FOUND);
        }
        return user;
    }
    async getUserProfile(userId) {
        const user = await this.validateUser(userId);
        return this.sanitizeUser(user);
    }
    async validateOAuthLogin(profile) {
        const { email, providerId, name, avatar, provider } = profile;
        let user = await this.userModel.findOne({ email, provider });
        if (!user) {
            user = await this.userModel.create({
                email,
                providerId,
                name,
                avatar,
                provider,
            });
        }
        return {
            accessToken: this.generateToken(user),
            user: this.sanitizeUser(user),
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException(auth_enum_1.AuthMessage.USER_NOT_FOUND);
        }
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + this.OTP_EXPIRY_MINUTES);
        user.resetPasswordOtp = this.HARDCODED_OTP;
        user.resetPasswordOtpExpires = otpExpiry;
        await user.save();
        return {
            message: auth_enum_1.AuthMessage.OTP_SENT,
        };
    }
    async resetPassword(resetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException(auth_enum_1.AuthMessage.USER_NOT_FOUND);
        }
        if (!user.resetPasswordOtp ||
            user.resetPasswordOtp !== otp ||
            !user.resetPasswordOtpExpires ||
            new Date() > user.resetPasswordOtpExpires) {
            throw new common_1.BadRequestException(auth_enum_1.AuthMessage.INVALID_OTP);
        }
        user.password = await this.hashPassword(newPassword);
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();
        return {
            message: auth_enum_1.AuthMessage.PASSWORD_RESET_SUCCESS,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map