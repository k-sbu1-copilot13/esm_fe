import axiosInstance from '../../../api/axiosInstance';
import type { FormTemplate, PaginatedResponse } from '../types';

/**
 * Fetch all form templates for admin (includes full details and inactive ones) with pagination and search.
 * @param params Object containing page, size, and search query
 * @returns Promise with paginated response of form templates
 */
export const getAdminTemplates = async (params?: {
    page?: number;
    size?: number;
    search?: string;
    sort?: string;
}): Promise<PaginatedResponse<FormTemplate>> => {
    const response = await axiosInstance.get<PaginatedResponse<FormTemplate>>('/admin/form-templates', {
        params: {
            ...params,
            page: params?.page ?? 0,
            size: params?.size ?? 10,
        }
    });
    return response.data;
};

/**
 * Fetch form templates for employees with pagination and search.
 * @param params Object containing page, size, and search query
 * @returns Promise with paginated response of form templates
 */
export const getEmployeeTemplates = async (params?: {
    page?: number;
    size?: number;
    search?: string;
    sort?: string;
}): Promise<PaginatedResponse<FormTemplate>> => {
    const response = await axiosInstance.get<PaginatedResponse<FormTemplate>>('/form-templates', {
        params: {
            ...params,
            // Spring Data Pageable uses 0-indexed page by default
            page: params?.page ?? 0,
            size: params?.size ?? 10,
        }
    });
    return response.data;
};
