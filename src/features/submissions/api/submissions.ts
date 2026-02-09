import axiosInstance from '../../../api/axiosInstance';
import type { SaveDraftRequest, SaveDraftResponse, PaginatedResponse } from '../types';
import type { FormTemplate } from '../../templates/types';

/**
 * Fetch a single form template by ID.
 * This is a proxy to the template API but kept here for submission feature context.
 */
export const getTemplateById = async (id: number | string): Promise<FormTemplate> => {
    const response = await axiosInstance.get<FormTemplate>(`/form-templates/${id}`);
    const data = response.data;
    if (data.workflow && !data.workflowSteps) {
        data.workflowSteps = data.workflow;
    }
    return data;
};

/**
 * Save form as a draft.
 * @param data The draft data
 * @param employeeId The ID of the employee saving the draft
 */
export const saveDraft = async (data: SaveDraftRequest, employeeId: number | string): Promise<SaveDraftResponse> => {
    const response = await axiosInstance.post<SaveDraftResponse>('/submissions/draft', data, {
        headers: {
            'X-Employee-Id': employeeId
        }
    });
    return response.data;
};

/**
 * Submit form for approval.
 * @param data The submission data
 * @param employeeId The ID of the employee submitting the form
 */
export const submitForm = async (data: any, employeeId: number | string): Promise<any> => {
    const response = await axiosInstance.post('/submissions/submit', data, {
        headers: {
            'X-Employee-Id': employeeId
        }
    });
    return response.data;
};

/**
 * Get all draft submissions for the current user with pagination and search.
 * @param employeeId The ID of the employee fetching drafts
 * @param params Object containing page, size, and search query
 */
export const getDraftSubmissions = async (
    employeeId: number | string,
    params?: {
        page?: number;
        size?: number;
        search?: string;
    }
): Promise<PaginatedResponse<SaveDraftResponse>> => {
    const response = await axiosInstance.get<PaginatedResponse<SaveDraftResponse>>('/submissions/me/drafts', {
        headers: {
            'X-Employee-Id': employeeId
        },
        params: {
            ...params,
            page: params?.page ?? 0,
            size: params?.size ?? 10,
        }
    });
    return response.data;
};

/**
 * Get all submitted submissions for the current user with pagination and search.
 * @param employeeId The ID of the employee fetching submitted applications
 * @param params Object containing page, size, and search query
 */
export const getSubmittedSubmissions = async (
    employeeId: number | string,
    params?: {
        page?: number;
        size?: number;
        search?: string;
    }
): Promise<PaginatedResponse<SaveDraftResponse>> => {
    const response = await axiosInstance.get<PaginatedResponse<SaveDraftResponse>>('/submissions/me/submitted', {
        headers: {
            'X-Employee-Id': employeeId
        },
        params: {
            ...params,
            page: params?.page ?? 0,
            size: params?.size ?? 10,
        }
    });
    return response.data;
};

/**
 * Get a single submission by ID.
 * @param id The submission ID
 * @param employeeId The ID of the employee fetching the submission
 */
export const getSubmissionById = async (id: number | string, employeeId: number | string): Promise<SaveDraftResponse> => {
    const response = await axiosInstance.get<SaveDraftResponse>(`/submissions/${id}`, {
        headers: {
            'X-Employee-Id': employeeId
        }
    });
    return response.data;
};

/**
 * Update form as a draft.
 */
export const updateDraft = async (id: number | string, data: SaveDraftRequest, employeeId: number | string): Promise<SaveDraftResponse> => {
    const response = await axiosInstance.put<SaveDraftResponse>(`/submissions/draft/${id}`, data, {
        headers: {
            'X-Employee-Id': employeeId
        }
    });
    return response.data;
};

/**
 * Submit an existing draft.
 */
export const submitDraft = async (id: number | string, data: any, employeeId: number | string): Promise<any> => {
    const response = await axiosInstance.put(`/submissions/submit/${id}`, data, {
        headers: {
            'X-Employee-Id': employeeId
        }
    });
    return response.data;
};
/**
 * Delete a submission by ID.
 * @param id The submission ID
 * @param employeeId The ID of the employee deleting the submission
 */
export const deleteSubmission = async (id: number | string, employeeId: number | string): Promise<void> => {
    await axiosInstance.delete(`/submissions/${id}`, {
        headers: {
            'X-Employee-Id': employeeId
        }
    });
};
