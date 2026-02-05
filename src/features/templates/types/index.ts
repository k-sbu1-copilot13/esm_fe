export const ComponentType = {
    TEXT_SHORT: 'TEXT_SHORT',
    TEXT_AREA: 'TEXT_AREA',
    NUMBER: 'NUMBER',
    DATE_PICKER: 'DATE_PICKER',
    TIME_PICKER: 'TIME_PICKER',
} as const;

export type ComponentType = (typeof ComponentType)[keyof typeof ComponentType];

export interface FormField {
    id?: number;
    label: string;
    componentType: ComponentType;
    required: boolean;
    displayOrder: number;
}

export interface WorkflowStep {
    id?: number;
    managerId: number;
    managerName?: string;
    stepOrder: number;
}

export interface FormTemplate {
    id?: number;
    title: string;
    description: string;
    active: boolean;
    createdAt?: string;
    fields: FormField[];
    workflowSteps: WorkflowStep[];
    workflow?: WorkflowStep[]; // Alias for backend consistency
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
