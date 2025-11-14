import { Document, Types } from 'mongoose';
export type UserDocument = User & Document & {
    _id: Types.ObjectId;
};
export declare class User {
    email: string;
    password: string;
    name: string;
    isActive: boolean;
    provider: string;
    providerId: string;
    avatar?: string;
    resetPasswordOtp?: string;
    resetPasswordOtpExpires?: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
