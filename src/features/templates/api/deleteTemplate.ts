import axiosInstance from '../../../api/axiosInstance';

/**
 * Deletes a form template.
 * @param id The ID of the template to delete.
 */
export const deleteTemplate = async (id: number | string) => {
    const response = await axiosInstance.delete(`/admin/form-templates/${id}`);
    return response.data;
};
