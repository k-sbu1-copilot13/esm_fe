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
    Tag,
    Steps
} from 'antd';
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SolutionOutlined,
    ClockCircleOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getSubmissionById } from '../api/submissions';
import { useAuthStore } from '../../../store/authStore';
import { ComponentType } from '../../templates';

const { Title, Text } = Typography;

const EmployeeSubmissionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewingArchive, setViewingArchive] = useState<{ date: string, action: string } | null>(null);
    const user = useAuthStore((state) => state.user);

    // Reconstruct state for Archive view
    const logId = searchParams.get('logId');
    const activeLog = logId && submission?.fullHistory
        ? submission.fullHistory.find((l: any) => l.id.toString() === logId)
        : null;

    const displayWorkflowSteps = (activeLog && submission?.workflowSteps)
        ? submission.workflowSteps.map((step: any) => {
            if (step.stepOrder === activeLog.atStep) {
                return {
                    ...step,
                    status: activeLog.action === 'APPROVE' ? 'APPROVED' : (activeLog.action === 'REJECT' ? 'REJECTED' : activeLog.action),
                    comment: activeLog.comment,
                    updatedAt: activeLog.actedAt,
                    historicalValues: activeLog.historicalValues
                };
            }
            if (step.stepOrder < activeLog.atStep) {
                // Find previous log for this step
                const prevLog = submission.fullHistory
                    .filter((l: any) => l.atStep === step.stepOrder && (l.id < activeLog.id || !activeLog.id))
                    .sort((a: any, b: any) => b.id - a.id)[0];
                if (prevLog) {
                    return {
                        ...step,
                        status: prevLog.action === 'APPROVE' ? 'APPROVED' : (prevLog.action === 'REJECT' ? 'REJECTED' : prevLog.action),
                        comment: prevLog.comment,
                        updatedAt: prevLog.actedAt,
                        historicalValues: prevLog.historicalValues
                    };
                }
            }
            return {
                ...step,
                status: 'PENDING',
                comment: null,
                updatedAt: null,
                historicalValues: null
            };
        })
        : submission?.workflowSteps;

    useEffect(() => {
        const fetchSubmission = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const data = await getSubmissionById(id);
                setSubmission(data);

                // Initialize form with submission values
                const initialValues: Record<string, any> = {};

                // Check if we are viewing a specific historical version
                const logId = searchParams.get('logId');
                let valuesToUse = data.submissionValues;

                if (logId && data.fullHistory) {
                    const historicalLog = data.fullHistory.find((l: any) => l.id.toString() === logId);
                    if (historicalLog && historicalLog.historicalValues) {
                        valuesToUse = historicalLog.historicalValues;
                        setViewingArchive({
                            date: dayjs(historicalLog.actedAt).format('DD/MM/YYYY HH:mm'),
                            action: historicalLog.action
                        });
                    }
                }

                valuesToUse.forEach((val: any) => {
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

        fetchSubmission();
    }, [id, form, searchParams]);

    const renderField = (field: any) => {
        const commonProps = {
            style: { width: '100%', borderRadius: 8 },
            readOnly: true,
            disabled: true
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

            {/* SECTION 1: HEADER - Info */}
            <Card
                bordered={false}
                className="glass-morphism"
                style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}
                bodyStyle={{ padding: '20px 24px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div>
                        <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4, textAlign: 'center' }}>SUBMISSION DATE</Text>
                        <Space size={12}>
                            <div style={{ background: '#f6ffed', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                                <SolutionOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                            </div>
                            <Text strong style={{ fontSize: 18 }}>{dayjs(submission.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                        </Space>
                    </div>
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

            {/* Approval Process Steps (Footer) */}
            {displayWorkflowSteps && displayWorkflowSteps.length > 0 && (
                <Card
                    bordered={false}
                    className="glass-morphism"
                    title={<Space><SolutionOutlined /><span>Approval History</span></Space>}
                    style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                >
                    <Steps
                        direction="vertical"
                        size="small"
                        current={
                            viewingArchive
                                ? activeLog.atStep - 1
                                : (submission.status === 'APPROVED' || submission.status === 'REJECTED' ? displayWorkflowSteps.length : submission.currentStep - 1)
                        }
                        items={displayWorkflowSteps.map((step: any) => ({
                            title: (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Text strong style={{ fontSize: 16 }}>Step {step.stepOrder}: {step.managerName || 'Manager'}</Text>
                                </div>
                            ),
                            description: (
                                <div style={{ padding: '12px 0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text type="secondary" style={{ width: 100, display: 'inline-block' }}>Status:</Text>
                                        <Tag
                                            color={step.status === 'APPROVED' ? 'green' : step.status === 'REJECTED' ? 'red' : 'default'}
                                            style={{ margin: 0, fontWeight: 700, padding: '4px 16px', borderRadius: 6, fontSize: 13 }}
                                        >
                                            {step.status || 'PENDING'}
                                        </Tag>
                                    </div>

                                    {(step.status === 'APPROVED' || step.status === 'REJECTED') && step.updatedAt && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Text type="secondary" style={{ width: 100, display: 'inline-block' }}>Time:</Text>
                                            <Text strong style={{ fontSize: 14 }}>
                                                <ClockCircleOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
                                                {dayjs(step.updatedAt).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        </div>
                                    )}

                                    {step.comment && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <Text type="secondary" style={{ width: 100, display: 'inline-block', marginTop: 8 }}>Reason:</Text>
                                            <div style={{
                                                flex: 1,
                                                background: '#f8f9fa',
                                                padding: '12px 16px',
                                                borderRadius: 10,
                                                borderLeft: `4px solid ${step.status === 'APPROVED' ? '#52c41a' : step.status === 'REJECTED' ? '#ff4d4f' : '#d9d9d9'}`,
                                                fontStyle: 'italic',
                                                color: '#444',
                                                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.02)',
                                                fontSize: 14,
                                                lineHeight: 1.6
                                            }}>
                                                "{step.comment}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ),
                            icon: step.status === 'APPROVED' ? (
                                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                            ) : step.status === 'REJECTED' ? (
                                <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                            ) : (
                                <ClockCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
                            ),
                        }))}
                    />

                    <Divider style={{ margin: '24px 0 16px' }} />

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <Text strong style={{ color: '#8c8c8c', letterSpacing: 0.5 }}>FINAL STATUS</Text>
                        <Tag
                            color={
                                (viewingArchive ? (activeLog.action === 'APPROVE' ? 'APPROVED' : 'REJECTED') : submission.status) === 'APPROVED' ? 'success' :
                                    (viewingArchive ? (activeLog.action === 'APPROVE' ? 'APPROVED' : 'REJECTED') : submission.status) === 'REJECTED' ? 'error' :
                                        'processing'
                            }
                            style={{
                                fontSize: 16,
                                padding: '6px 20px',
                                borderRadius: 8,
                                fontWeight: 700,
                                margin: 0,
                                boxShadow: (viewingArchive ? (activeLog.action === 'APPROVE' ? 'APPROVED' : 'REJECTED') : submission.status) === 'APPROVED' ? '0 4px 10px rgba(82,196,26,0.2)' :
                                    (viewingArchive ? (activeLog.action === 'APPROVE' ? 'APPROVED' : 'REJECTED') : submission.status) === 'REJECTED' ? '0 4px 10px rgba(255,77,79,0.2)' : 'none'
                            }}
                        >
                            {viewingArchive ? activeLog.action : (submission.status || 'PENDING')}
                        </Tag>

                        {submission.status === 'REJECTED' && (
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                size="large"
                                onClick={() => navigate(`/submissions/edit/${submission.id}`)}
                                style={{
                                    borderRadius: 8,
                                    marginLeft: 16,
                                    background: '#ff4d4f',
                                    borderColor: '#ff4d4f',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 10px rgba(255,77,79,0.3)'
                                }}
                            >
                                Resubmit
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default EmployeeSubmissionDetailPage;
