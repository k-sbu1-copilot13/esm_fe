import axiosInstance from '../../../api/axiosInstance';
import type { FormTemplate } from '../types';

/**
 * Creates a new form template.
 * @param data The form template data to create.
 */
export const createTemplate = async (data: FormTemplate) => {
    const response = await axiosInstance.post<FormTemplate>('/admin/form-templates', data);
    return response.data;
};
