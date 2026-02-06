import axiosInstance from '../../../api/axiosInstance';
import type { PendingApproval, ApprovalHistory } from '../types';
import type { PaginatedResponse } from '../../submissions/types';

/**
 * Fetch list of pending approvals for a manager.
 * @param managerId The ID of the manager
 * @param params Pagination parameters
 */
export const getPendingApprovals = async (
    managerId: number | string,
    params?: {
        page?: number;
        size?: number;
        search?: string;
    }
): Promise<PaginatedResponse<PendingApproval>> => {
    const response = await axiosInstance.get<PaginatedResponse<PendingApproval>>('/approvals/pending', {
        headers: {
            'X-Manager-Id': managerId
        },
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
 * @param managerId The ID of the manager
 * @param params Pagination parameters
 */
export const getApprovalHistory = async (
    managerId: number | string,
    params?: {
        page?: number;
        size?: number;
        search?: string;
    }
): Promise<PaginatedResponse<ApprovalHistory>> => {
    const response = await axiosInstance.get<PaginatedResponse<ApprovalHistory>>('/approvals/history', {
        headers: {
            'X-Manager-Id': managerId
        },
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
 * @param managerId The ID of the manager performing the action
 * @param data The action (APPROVE/REJECT) and optional comment
 */
export const processApproval = async (
    submissionId: number | string,
    managerId: number | string,
    data: {
        action: 'APPROVE' | 'REJECT';
        comment?: string;
    }
): Promise<any> => {
    const response = await axiosInstance.post(`/approvals/submissions/${submissionId}`, data, {
        headers: {
            'X-Manager-Id': managerId
        }
    });
    return response.data;
};

/**
 * Fetch submission detail for a manager.
 * @param submissionId The ID of the submission
 * @param managerId The ID of the manager
 */
export const getApprovalDetail = async (
    submissionId: number | string,
    managerId: number | string
): Promise<any> => {
    const response = await axiosInstance.get(`/approvals/submissions/${submissionId}`, {
        headers: {
            'X-Manager-Id': managerId
        }
    });
    return response.data;
};
