import { Model } from 'mongoose';
import { UserDocument } from '../auth/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getProfile(userId: string): Promise<{
        message: string;
        user: UserDocument;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
        message: string;
        user: UserDocument;
    }>;
    deleteAvatar(userId: string): Promise<{
        message: string;
        user: UserDocument;
    }>;
}
