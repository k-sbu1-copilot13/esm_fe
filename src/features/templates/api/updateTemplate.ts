import axiosInstance from '../../../api/axiosInstance';
import type { FormTemplate } from '../types';

/**
 * Updates an existing form template.
 * @param id The ID of the template to update.
 * @param data The updated form template data.
 */
export const updateTemplate = async (id: number | string, data: Partial<FormTemplate>) => {
    const response = await axiosInstance.put<FormTemplate>(`/admin/form-templates/${id}`, data);
    return response.data;
};
