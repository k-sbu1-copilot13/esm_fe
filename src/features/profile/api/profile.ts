import axiosInstance from '../../../api/axiosInstance';
import { type UserProfile } from '../types';

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>('/users/profile');
    return response.data;
};
