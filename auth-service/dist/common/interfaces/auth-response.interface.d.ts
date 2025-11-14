export interface UserResponse {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider?: string;
}
export interface AuthResponse {
    accessToken: string;
    user: UserResponse;
}
export interface RegisterResponse {
    message: string;
    user: UserResponse;
}
export interface OAuthProfile {
    email: string;
    providerId: string;
    name: string;
    avatar: string;
    provider: string;
}
