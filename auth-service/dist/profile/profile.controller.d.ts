import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<{
        message: string;
        user: import("../auth/schemas/user.schema").UserDocument;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto, file: Express.Multer.File): Promise<{
        message: string;
        user: import("../auth/schemas/user.schema").UserDocument;
    }>;
    deleteAvatar(req: any): Promise<{
        message: string;
        user: import("../auth/schemas/user.schema").UserDocument;
    }>;
}
