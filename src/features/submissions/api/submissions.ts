import axiosInstance from '../../../api/axiosInstance';
import type { SaveDraftRequest, SaveDraftResponse } from '../types';
import type { FormTemplate } from '../../templates/types';

/**
 * Fetch a single form template by ID.
 * This is a proxy to the template API but kept here for submission feature context.
 */
export const getTemplateById = async (id: number | string): Promise<FormTemplate> => {
    const response = await axiosInstance.get<FormTemplate>(`/admin/form-templates/${id}`);
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
