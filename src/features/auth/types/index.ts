export interface LoginRequest {
    username: String;
    password: String;
}

export interface LoginResponse {
    id: number;
    token: string;
    refreshToken: string;
    username: string;
    role: string;
    message?: string;
}

export interface User {
    id: number;
    username: string;
    fullName: string;
    role: string;
}

export interface Manager {
    id: number;
    username: string;
    fullName: string;
    role: string;
    status: string;
}
