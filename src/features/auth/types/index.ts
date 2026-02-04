export interface LoginRequest {
    username: String;
    password: String;
}

export interface LoginResponse {
    token: string;
    username: string;
    role: string;
    message?: string;
}

export interface User {
    username: string;
    role: string;
}
