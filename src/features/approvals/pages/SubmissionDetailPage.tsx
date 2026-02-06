import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
    Space,
    Radio,
    Tag
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SolutionOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getSubmissionById } from '../../submissions/api/submissions';
import { useAuthStore } from '../../../store/authStore';
import { ComponentType } from '../../templates';
import { Steps } from 'antd';
import { processApproval, getApprovalDetail } from '../api/approvals';

const { Title, Paragraph, Text } = Typography;

const SubmissionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const isViewOnly = searchParams.get('isViewOnly') === 'true';
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [decisionForm] = Form.useForm();
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const user = useAuthStore((state) => state.user);

    const myActionStep = submission?.workflowSteps?.find(
        (step: any) => step.managerId === user?.id && step.status
    );

    useEffect(() => {
        const fetchSubmission = async () => {
            if (!id) {
                console.warn('Missing ID from URL:', { id });
                return;
            }

            if (!isViewOnly && !employeeId) {
                console.warn('Missing Employee ID from URL for approval mode:', { id, employeeId });
                return;
            }

            setLoading(true);
            try {
                let data;
                if (isViewOnly) {
                    console.log('Fetching submission details for manager (view only):', { id, managerId: user?.id });
                    data = await getApprovalDetail(id, user!.id);
                } else {
                    console.log('Fetching submission details for approval:', { id, employeeId });
                    data = await getSubmissionById(id, employeeId!);
                }

                console.log('Submission data received:', data);
                setSubmission(data);

                // Initialize form with submission values
                const initialValues: Record<string, any> = {};
                data.submissionValues.forEach((val: any) => {
                    initialValues[val.fieldId] = val.value;
                });
                form.setFieldsValue(initialValues);
            } catch (error) {
                console.error('Failed to fetch submission:', error);
                message.error('Failed to load submission details.');
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) {
            fetchSubmission();
        }
    }, [id, user?.id, form, isViewOnly, employeeId]);

    const renderField = (field: any) => {
        const commonProps = {
            style: { width: '100%', borderRadius: 8 },
            readOnly: true,
            disabled: true // Keep it disabled as it's a detail view for manager
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

    const handleSaveAction = async () => {
        if (!user?.id || !id) return;

        try {
            setSaving(true);
            const values = await decisionForm.validateFields();

            console.log('Submitting approval action:', { id, managerId: user.id, values });

            await processApproval(id, user.id, {
                action: values.action,
                comment: values.comment
            });

            message.success(`Submission ${values.action === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
            navigate('/');
        } catch (error: any) {
            if (error.errorFields) {
                // Validation error, already handled by form
                return;
            }
            console.error('Failed to process approval:', error);
            message.error(error.response?.data?.message || 'Failed to process approval action.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin size="large" tip="Loading submission details..." />
            </div>
        );
    }

    if (!submission) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Title level={4}>Submission not found</Title>
                <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 850, margin: '0 auto', padding: '24px 16px' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16, padding: 0 }}
            >
                Back to Dashboard
            </Button>

            {/* SECTION 1: HEADER - Submitter Info */}
            <Card
                bordered={false}
                className="glass-morphism"
                style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}
                bodyStyle={{ padding: '20px 24px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Space size={48}>
                        <div>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4, textAlign: 'center' }}>SUBMITTED BY</Text>
                            <Space size={12}>
                                <div style={{ background: '#e6f7ff', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                                    <UserOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                                </div>
                                <Text strong style={{ fontSize: 18 }}>{submission.employeeName}</Text>
                            </Space>
                        </div>
                        <Divider type="vertical" style={{ height: 50, margin: '0 24px' }} />
                        <div>
                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4, textAlign: 'center' }}>SUBMISSION DATE</Text>
                            <Space size={12}>
                                <div style={{ background: '#f6ffed', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                                    <SolutionOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                                </div>
                                <Text strong style={{ fontSize: 18 }}>{dayjs(submission.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                            </Space>
                        </div>
                    </Space>
                </div>
            </Card>

            {/* SECTION 2: MAIN - Submission Details */}
            <Card
                bordered={false}
                className="glass-morphism"
                style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Title level={3} style={{ marginBottom: 4 }}>{submission.templateTitle}</Title>
                </div>

                <Divider style={{ marginTop: 0 }} />

                <Form
                    form={form}
                    layout="vertical"
                >
                    {submission.submissionValues.map((field: any) => (
                        <Form.Item
                            key={field.fieldId}
                            name={field.fieldId}
                            label={<span style={{ fontWeight: 600 }}>{field.label}</span>}
                            style={{ marginBottom: 20 }}
                            {...(field.componentType === ComponentType.DATE_PICKER ? {
                                getValueProps: (value: any) => ({ value: value ? dayjs(value) : undefined }),
                            } : {})}
                            {...(field.componentType === ComponentType.TIME_PICKER ? {
                                getValueProps: (value: any) => ({ value: value ? dayjs(value, 'HH:mm:ss') : undefined }),
                            } : {})}
                        >
                            {renderField(field)}
                        </Form.Item>
                    ))}
                </Form>
            </Card>

            {/* SECTION 3: DECISION - Approve/Reject & Reason (Only if in approval mode) */}
            {!isViewOnly && submission.status === 'PENDING' && (
                <Card
                    bordered={false}
                    className="glass-morphism"
                    style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}
                >
                    <Title level={4} style={{ marginBottom: 20 }}>Manager Decision</Title>
                    <Form form={decisionForm} layout="vertical">
                        <Form.Item
                            name="action"
                            label={<span style={{ fontWeight: 600 }}>Decision</span>}
                            rules={[{ required: true, message: 'Please select a decision' }]}
                        >
                            <Radio.Group buttonStyle="solid" size="large" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <Radio.Button value="APPROVE" style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderLeft: '1px solid #d9d9d9' }}>
                                        <Space><CheckCircleOutlined /> Approve</Space>
                                    </Radio.Button>
                                    <Radio.Button value="REJECT" style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                        <Space><CloseCircleOutlined /> Reject</Space>
                                    </Radio.Button>
                                </div>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
                        >
                            {({ getFieldValue }) => (
                                <Form.Item
                                    name="comment"
                                    label={<span style={{ fontWeight: 600 }}>Reason</span>}
                                    style={{ marginBottom: 24 }}
                                    rules={[
                                        {
                                            required: getFieldValue('action') === 'REJECT',
                                            message: 'Please provide a reason for rejection'
                                        }
                                    ]}
                                >
                                    <Input.TextArea
                                        placeholder={getFieldValue('action') === 'REJECT' ? "Please provide a reason for rejection (required)..." : "Please provide a reason for your decision (optional)..."}
                                        autoSize={{ minRows: 4, maxRows: 8 }}
                                        style={{ borderRadius: 10 }}
                                    />
                                </Form.Item>
                            )}
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                size="large"
                                onClick={handleSaveAction}
                                loading={saving}
                                style={{
                                    borderRadius: 12,
                                    minWidth: 120,
                                    height: 48,
                                    background: 'linear-gradient(90deg, #1890ff 0%, #001529 100%)',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: 17,
                                    boxShadow: '0 8px 15px rgba(24, 144, 255, 0.25)'
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}

            {/* SECTION 4: YOUR DECISION (For processed applications) */}
            {isViewOnly && myActionStep && (
                <Card
                    bordered={false}
                    className="glass-morphism"
                    style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}
                >
                    <Title level={4} style={{ marginBottom: 20 }}>Your Decision</Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text strong style={{ width: 120, display: 'inline-block' }}>Action:</Text>
                            <Tag color={myActionStep.status === 'APPROVED' ? 'green' : 'red'} style={{ margin: 0 }}>
                                {myActionStep.status}
                            </Tag>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Text strong style={{ width: 120, display: 'inline-block', marginTop: 8 }}>Reason:</Text>
                            <div style={{
                                flex: 1,
                                padding: '12px 16px',
                                background: '#f8f9fa',
                                borderRadius: 10,
                                fontStyle: 'italic',
                                color: '#555',
                                border: '1px solid #eee'
                            }}>
                                {myActionStep.comment ? `"${myActionStep.comment}"` : "None"}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text strong style={{ width: 120, display: 'inline-block' }}>Processed at:</Text>
                            <Text type="secondary">
                                {dayjs(myActionStep.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </Text>
                        </div>
                    </div>
                </Card>
            )}

            {/* Approval Process Steps (Footer) */}
            {submission.workflowSteps && submission.workflowSteps.length > 0 && (
                <Card
                    bordered={false}
                    className="glass-morphism"
                    title={<Space><SolutionOutlined /><span>Approval History</span></Space>}
                    style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                >
                    <Steps
                        direction="vertical"
                        size="small"
                        current={submission.status === 'APPROVED' || submission.status === 'REJECTED' ? submission.workflowSteps.length : submission.currentStep - 1}
                        items={submission.workflowSteps.map((step: any) => ({
                            title: `Step ${step.stepOrder}: ${step.managerName || 'Manager'}`,
                            description: (
                                <Tag color={
                                    step.status === 'APPROVED' ? 'green' :
                                        step.status === 'REJECTED' ? 'red' :
                                            'default'
                                }>
                                    {step.status || 'Pending'}
                                </Tag>
                            ),
                            icon: step.status === 'APPROVED' ? (
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            ) : step.status === 'REJECTED' ? (
                                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                            ) : (
                                <ClockCircleOutlined style={{ color: '#faad14' }} />
                            ),
                        }))}
                    />

                    <Divider style={{ margin: '24px 0 16px' }} />

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                        <Text strong style={{ color: '#8c8c8c', letterSpacing: 0.5 }}>FINAL STATUS</Text>
                        <Tag
                            color={
                                submission.status === 'APPROVED' ? 'success' :
                                    submission.status === 'REJECTED' ? 'error' :
                                        'processing'
                            }
                            style={{
                                fontSize: 16,
                                padding: '6px 20px',
                                borderRadius: 8,
                                fontWeight: 700,
                                margin: 0,
                                boxShadow: submission.status === 'APPROVED' ? '0 4px 10px rgba(82,196,26,0.2)' :
                                    submission.status === 'REJECTED' ? '0 4px 10px rgba(255,77,79,0.2)' : 'none'
                            }}
                        >
                            {submission.status || 'PENDING'}
                        </Tag>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SubmissionDetailPage;
