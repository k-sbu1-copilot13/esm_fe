import type { PaginatedResponse } from '../../../types';
import type { FormTemplate } from '../../templates/types';

export interface SubmissionValue {
    fieldId: number;
    label: string;
    componentType: string;
    value: any;
}

export interface WorkflowStep {
    stepOrder: number;
    managerId: number;
    managerName: string;
    status: string;
    comment?: string;
    updatedAt: string;
}

export interface SaveDraftRequest {
    id?: number;
    templateId: number;
    values: Record<string, any>;
}

export interface SaveDraftResponse {
    id: number;
    templateId: number;
    templateTitle: string;
    employeeId: number;
    employeeName: string;
    submissionValues: SubmissionValue[];
    workflowSteps: WorkflowStep[];
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    currentStep: number;
    createdAt: string;
}

export interface SubmitRequest {
    templateId: number;
    values: Record<string, any>;
}

export interface SubmitResponse {
    id: number;
    status: string;
    message?: string;
}

export type { FormTemplate, PaginatedResponse };
