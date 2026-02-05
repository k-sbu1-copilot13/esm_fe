export interface FormField {
    id: number;
    label: string;
    componentType: string;
    required: boolean;
    displayOrder: number;
}

export interface WorkflowStep {
    id: number;
    managerId: number;
    managerName: string;
    stepOrder: number;
}

export interface FormTemplate {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    fields: FormField[];
    workflow: WorkflowStep[];
    active: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
}
