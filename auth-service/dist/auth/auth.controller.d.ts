import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<import("../common/interfaces/auth-response.interface").RegisterResponse>;
    login(loginDto: LoginDto): Promise<import("../common/interfaces/auth-response.interface").AuthResponse>;
    getProfile(req: any): Promise<import("../common/interfaces/auth-response.interface").UserResponse>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
}
