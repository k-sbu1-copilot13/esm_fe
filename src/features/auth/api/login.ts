import axiosInstance from '../../../api/axiosInstance';
import { LoginRequest, LoginResponse } from '../types';

/**
 * Call the Login API endpoint.
 * @param data Login credentials
 * @returns Login response with JWT token
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
    return response.data;
};
