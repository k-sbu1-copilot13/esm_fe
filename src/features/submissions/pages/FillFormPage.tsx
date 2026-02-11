import React from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import {
    Form,
    Button,
    Card,
    Typography,
    Spin,
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
import { useSubmissionForm } from '../hooks/useSubmissionForm';
import { ComponentType, DynamicField } from '../../templates';

const { Title, Paragraph } = Typography;

const FillFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {
        form,
        template,
        loading,
        saving,
        submitting,
        handleSave,
        handleSubmit,
        navigate
    } = useSubmissionForm(id, false);

    const renderField = (field: any) => {
        return (
            <DynamicField
                componentType={field.componentType}
                label={field.label}
            />
        );
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
                                {...(field.componentType === ComponentType.DATE_PICKER ? {
                                    getValueProps: (value: any) => ({ value: value ? dayjs(value) : undefined }),
                                    getValueFromEvent: (date: any) => date ? date.format('YYYY-MM-DD') : undefined
                                } : {})}
                                {...(field.componentType === ComponentType.TIME_PICKER ? {
                                    getValueProps: (value: any) => ({ value: value ? dayjs(value, 'HH:mm:ss') : undefined }),
                                    getValueFromEvent: (time: any) => time ? time.format('HH:mm:ss') : undefined
                                } : {})}
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
