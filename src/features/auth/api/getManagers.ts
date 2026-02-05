import axiosInstance from '../../../api/axiosInstance';

/**
 * Fetches the list of managers.
 */
export const getManagers = async () => {
    const response = await axiosInstance.get<any>('/users/managers');
    // The backend consistently returns a paginated response with a 'content' field
    return response.data;
};
