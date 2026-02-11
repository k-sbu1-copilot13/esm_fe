import axiosInstance from '../../../api/axiosInstance';
import { type PaginatedResponse, type User, type UserQueryParams } from '../types';

export const getUsers = async (params?: UserQueryParams): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
};

export const getUserById = async (id: number | string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
};

export const updateUserRoleStatus = async (id: number | string, data: { role: string; status: string }): Promise<User> => {
    const response = await axiosInstance.patch<User>(`/users/${id}/role-status`, data);
    return response.data;
};
