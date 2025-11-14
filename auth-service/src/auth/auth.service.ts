import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthMessage } from '../common/enums/auth.enum';
import {
  AuthResponse,
  RegisterResponse,
  OAuthProfile,
  UserResponse,
} from '../common/interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private readonly BCRYPT_SALT_ROUNDS = 10;
  private readonly HARDCODED_OTP = '123456';
  private readonly OTP_EXPIRY_MINUTES = 10;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, password, name } = registerDto;

    await this.checkUserExists(email);

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    return {
      message: AuthMessage.USER_REGISTERED,
      user: this.sanitizeUser(user),
    };
  }

  private async checkUserExists(email: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ email }).lean();
    if (existingUser) {
      throw new ConflictException(AuthMessage.USER_ALREADY_EXISTS);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private sanitizeUser(user: UserDocument): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      ...(user.avatar && { avatar: user.avatar }),
      ...(user.provider && { provider: user.provider }),
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(AuthMessage.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthMessage.INVALID_CREDENTIALS);
    }

    return {
      accessToken: this.generateToken(user),
      user: this.sanitizeUser(user),
    };
  }

  async validateUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException(AuthMessage.USER_NOT_FOUND);
    }
    return user;
  }

  async getUserProfile(userId: string): Promise<UserResponse> {
    const user = await this.validateUser(userId);
    return this.sanitizeUser(user);
  }

  async validateOAuthLogin(profile: OAuthProfile): Promise<AuthResponse> {
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(AuthMessage.USER_NOT_FOUND);
    }

    // Store hardcoded OTP with expiry
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + this.OTP_EXPIRY_MINUTES);

    user.resetPasswordOtp = this.HARDCODED_OTP;
    user.resetPasswordOtpExpires = otpExpiry;
    await user.save();

    // In production, send OTP via email service
    return {
      message: AuthMessage.OTP_SENT,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(AuthMessage.USER_NOT_FOUND);
    }

    if (
      !user.resetPasswordOtp ||
      user.resetPasswordOtp !== otp ||
      !user.resetPasswordOtpExpires ||
      new Date() > user.resetPasswordOtpExpires
    ) {
      throw new BadRequestException(AuthMessage.INVALID_OTP);
    }

    user.password = await this.hashPassword(newPassword);
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    return {
      message: AuthMessage.PASSWORD_RESET_SUCCESS,
    };
  }
}
