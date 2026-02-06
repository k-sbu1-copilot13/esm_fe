export interface PendingApproval {
    id: number;
    submissionId: number;
    templateTitle: string;
    employeeId: number;
    employeeName: string;
    createdAt: string;
    status: string;
    currentStep: number;
}

export interface ApprovalHistory {
    id: number;
    submissionId: number;
    templateTitle: string;
    employeeName: string;
    action: string;
    comment?: string;
    atStep: number;
    actedAt: string;
}
