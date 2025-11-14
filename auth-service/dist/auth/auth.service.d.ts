import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponse, RegisterResponse, OAuthProfile, UserResponse } from '../common/interfaces/auth-response.interface';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    private readonly BCRYPT_SALT_ROUNDS;
    private readonly HARDCODED_OTP;
    private readonly OTP_EXPIRY_MINUTES;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<RegisterResponse>;
    private checkUserExists;
    private hashPassword;
    private verifyPassword;
    private sanitizeUser;
    private generateToken;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(userId: string): Promise<UserDocument>;
    getUserProfile(userId: string): Promise<UserResponse>;
    validateOAuthLogin(profile: OAuthProfile): Promise<AuthResponse>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
