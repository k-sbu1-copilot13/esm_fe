import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    InputNumber,
    DatePicker,
    TimePicker,
    Button,
    Card,
    Typography,
    Spin,
    message,
    Divider,
    Steps,
    Space
} from 'antd';
import {
    SaveOutlined,
    SendOutlined,
    ArrowLeftOutlined,
    SolutionOutlined,
    UserOutlined
} from '@ant-design/icons';
import { getTemplateById, saveDraft, submitForm } from '../api/submissions';
import type { FormTemplate } from '../types';
import { ComponentType } from '../../templates';
import { useAuthStore } from '../../../store/authStore';

const { Title, Paragraph } = Typography;

const FillFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [template, setTemplate] = useState<FormTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getTemplateById(id);
                setTemplate(data);
            } catch (error) {
                console.error('Failed to fetch template:', error);
                message.error('Failed to load form template.');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [id]);

    const renderField = (field: any) => {
        const commonProps = {
            placeholder: `Enter ${field.label.toLowerCase()}...`,
            style: { width: '100%', borderRadius: 8 }
        };

        switch (field.componentType) {
            case ComponentType.TEXT_SHORT:
                return <Input {...commonProps} />;
            case ComponentType.TEXT_AREA:
                return <Input.TextArea {...commonProps} autoSize={{ minRows: 3, maxRows: 6 }} />;
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

    const handleSave = async () => {
        if (!template || !user?.id) {
            message.error('Missing required information to save draft.');
            return;
        }

        setSaving(true);
        try {
            const values = form.getFieldsValue();
            console.log('Sending Draft Data:', { values });
            const draftData = {
                templateId: Number(template.id),
                values: values
            };

            const response = await saveDraft(draftData, user.id);
            console.log('Save Draft Success:', response);
            message.success('Draft saved successfully!');
        } catch (error: any) {
            console.error('Save Draft failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save draft.';
            message.error(`Save failed: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!template || !user?.id) {
            message.error('Missing required information to submit form.');
            return;
        }

        try {
            const values = await form.validateFields();
            console.log('Submitting Form Data:', { values });

            setSubmitting(true);
            const submissionData = {
                templateId: Number(template.id),
                values: values
            };

            await submitForm(submissionData, user.id);
            message.success('Form submitted successfully!');
            navigate('/');
        } catch (error: any) {
            if (error.errorFields) {
                // Ant Design form validation error
                console.error('Validation failed:', error);
                return;
            }
            console.error('Submission failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit form.';
            message.error(`Submission failed: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin size="large" tip="Loading form template..." />
            </div>
        );
    }

    if (!template) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Title level={4}>Template not found</Title>
                <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16, padding: 0 }}
            >
                Back to Dashboard
            </Button>

            <Card
                bordered={false}
                className="glass-morphism"
                style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>{template.title}</Title>
                    <Paragraph type="secondary" style={{ fontSize: 16 }}>
                        {template.description}
                    </Paragraph>
                </div>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    requiredMark="optional"
                >
                    {template.fields
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((field) => (
                            <Form.Item
                                key={field.id}
                                name={field.id}
                                label={<span style={{ fontWeight: 600 }}>{field.label}</span>}
                                rules={[{ required: field.required, message: `${field.label} is required` }]}
                            >
                                {renderField(field)}
                            </Form.Item>
                        ))}

                    <Divider style={{ margin: '32px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                        <Button
                            icon={<SaveOutlined />}
                            size="large"
                            onClick={handleSave}
                            loading={saving}
                            style={{ borderRadius: 10, minWidth: 120 }}
                        >
                            Save Draft
                        </Button>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            size="large"
                            onClick={handleSubmit}
                            loading={submitting}
                            style={{
                                borderRadius: 10,
                                minWidth: 120,
                                background: 'linear-gradient(90deg, #1890ff 0%, #001529 100%)',
                                border: 'none'
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            </Card>

            {(template.workflowSteps || template.workflow) && (
                <Card
                    bordered={false}
                    className="glass-morphism"
                    title={<Space><SolutionOutlined /><span>Approval Process</span></Space>}
                    style={{ borderRadius: 16, marginTop: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                >
                    <Steps
                        direction="vertical"
                        size="small"
                        current={0}
                        items={(template.workflowSteps || template.workflow || []).map((step: any) => ({
                            title: `Step ${step.stepOrder}: ${step.managerName || 'Manager'}`,
                            description: `Responsible for approval at this stage.`,
                            icon: <UserOutlined />,
                        }))}
                    />
                </Card>
            )}
        </div>
    );
};

export default FillFormPage;
