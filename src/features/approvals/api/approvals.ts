import axiosInstance from '../../../api/axiosInstance';
import type { PendingApproval, ApprovalHistory } from '../types';
import type { PaginatedResponse } from '../../submissions/types';

/**
 * Fetch list of pending approvals for a manager.
 * @param params Pagination parameters
 */
export const getPendingApprovals = async (
    params?: {
        page?: number;
        size?: number;
        search?: string;
    }
): Promise<PaginatedResponse<PendingApproval>> => {
    const response = await axiosInstance.get<PaginatedResponse<PendingApproval>>('/approvals/pending', {
        params: {
            ...params,
            page: params?.page ?? 0,
            size: params?.size ?? 10
        }
    });
    return response.data;
};

/**
 * Fetch list of processed approvals (history) for a manager.
 * @param params Pagination parameters
 */
export const getApprovalHistory = async (
    params?: {
        page?: number;
        size?: number;
        search?: string;
    }
): Promise<PaginatedResponse<ApprovalHistory>> => {
    const response = await axiosInstance.get<PaginatedResponse<ApprovalHistory>>('/approvals/history', {
        params: {
            ...params,
            page: params?.page ?? 0,
            size: params?.size ?? 10
        }
    });
    return response.data;
};
/**
 * Process a submission approval or rejection.
 * @param submissionId The ID of the submission
 * @param data The action (APPROVE/REJECT) and optional comment
 */
export const processApproval = async (
    submissionId: number | string,
    data: {
        action: 'APPROVE' | 'REJECT';
        comment?: string;
    }
): Promise<any> => {
    const response = await axiosInstance.post(`/approvals/submissions/${submissionId}`, data);
    return response.data;
};

/**
 * Fetch submission detail for a manager.
 * @param submissionId The ID of the submission
 */
export const getApprovalDetail = async (
    submissionId: number | string
): Promise<any> => {
    const response = await axiosInstance.get(`/approvals/submissions/${submissionId}`);
    return response.data;
};
