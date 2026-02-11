export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface BaseEntity {
    id: number;
    createdAt?: string;
    updatedAt?: string;
}
