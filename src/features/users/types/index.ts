export interface User {
    id: number;
    username: string;
    fullName: string;
    role: string;
    status: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface UserQueryParams {
    page?: number;
    size?: number;
    search?: string;
}
