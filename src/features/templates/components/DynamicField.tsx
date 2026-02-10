import React from 'react';
import { Input, InputNumber, DatePicker, TimePicker } from 'antd';
import { ComponentType } from '../types';
import { FIELD_LIMITS } from '../constants/fieldLimits';

interface DynamicFieldProps {
    componentType: ComponentType;
    label: string;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    value?: any;
    onChange?: (value: any) => void;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    componentType,
    label,
    placeholder,
    readOnly,
    disabled,
    ...rest
}) => {
    const commonProps = {
        placeholder: placeholder || `Enter ${label.toLowerCase()}...`,
        style: { width: '100%', borderRadius: 8 },
        readOnly,
        disabled,
        ...rest
    };

    switch (componentType) {
        case ComponentType.TEXT_SHORT:
            return <Input {...commonProps} maxLength={FIELD_LIMITS.SHORT_TEXT} showCount={!readOnly && !disabled} />;
        case ComponentType.TEXT_AREA:
            return (
                <Input.TextArea
                    {...commonProps}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    maxLength={FIELD_LIMITS.LONG_TEXT}
                    showCount={!readOnly && !disabled}
                />
            );
        case ComponentType.NUMBER:
            return <InputNumber {...commonProps} />;
        case ComponentType.DATE_PICKER:
            return <DatePicker {...commonProps} />;
        case ComponentType.TIME_PICKER:
            return <TimePicker {...commonProps} />;
        default:
            return <Input {...commonProps} />;
    }
};
