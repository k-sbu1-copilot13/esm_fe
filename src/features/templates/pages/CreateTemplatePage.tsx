import React from 'react';
import { Form, Input, Button, Card, Space, Select, Typography, Divider, Checkbox, Tooltip, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, MenuOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ComponentType } from '../types';
import { createTemplate } from '../api/createTemplate';
import { getManagers, type Manager } from '../../auth';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateTemplatePage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [managers, setManagers] = React.useState<Manager[]>([]);

    React.useEffect(() => {
        const fetchManagers = async () => {
            try {
                const data = await getManagers();
                // Check if the response follows the PaginatedResponse pattern
                if (data && data.content) {
                    setManagers(data.content);
                } else if (Array.isArray(data)) {
                    setManagers(data);
                } else {
                    setManagers([]);
                }
            } catch (error) {
                console.error('Failed to fetch managers:', error);
                message.error('Could not load manager list.');
            }
        };
        fetchManagers();
    }, []);

    const onFinish = async (values: any) => {
        // Frontend Validation
        if (!values.fields || values.fields.length === 0) {
            message.warning('Please add at least one form field.');
            return;
        }

        if (!values.workflowSteps || values.workflowSteps.length === 0) {
            message.warning('A form template must have at least one workflow (approval) step.');
            return;
        }

        setLoading(true);
        try {
            // Prepare the payload according to the strict JSON format provided
            const payload = {
                title: values.title,
                description: values.description || '',
                fields: (values.fields || []).map((field: any, index: number) => ({
                    label: field.label,
                    componentType: field.componentType,
                    required: !!field.required,
                    displayOrder: index + 1
                })),
                workflowSteps: (values.workflowSteps || []).map((step: any, index: number) => ({
                    managerId: step.managerId,
                    stepOrder: index + 1
                })),
                active: !!values.active
            };

            console.log('Strict Payload for Backend:', payload);
            await createTemplate(payload as any);
            message.success('Form template created successfully!');
            navigate('/');
        } catch (error: any) {
            console.error('Failed to create template:', error);

            // Handle structured validation errors from backend
            let errorMessage = 'Failed to create form template.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                // Beautify common validation messages
                if (errorMessage.includes('workflowSteps') && errorMessage.includes('at least one')) {
                    errorMessage = 'Configuration Error: Please add at least one workflow step for the approval process.';
                } else if (errorMessage.includes('fields') && errorMessage.includes('at least one')) {
                    errorMessage = 'Configuration Error: At least one form field is required.';
                }
            }

            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const componentOptions = [
        { label: 'Short Text', value: ComponentType.TEXT_SHORT, icon: <Text>T</Text> },
        { label: 'Long Text', value: ComponentType.TEXT_AREA, icon: <Text>TA</Text> },
        { label: 'Number', value: ComponentType.NUMBER, icon: <Text>#</Text> },
        { label: 'Date Picker', value: ComponentType.DATE_PICKER, icon: <Text>D</Text> },
        { label: 'Time Picker', value: ComponentType.TIME_PICKER, icon: <Text>H</Text> },
    ];


    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 24, padding: 0 }}
            >
                Back to Dashboard
            </Button>

            <Card className="glass-morphism" style={{ borderRadius: 20, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>Design Your Application Form</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Create a structured template by adding fields and defining their properties.
                    </Text>
                </div>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ fields: [], active: true }}
                    autoComplete="off"
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
                        <Form.Item
                            label={<Text strong>Form Title</Text>}
                            name="title"
                            rules={[{ required: true, message: 'Please enter form title' }]}
                        >
                            <Input placeholder="e.g., Equipment Request Form" size="large" style={{ borderRadius: 8 }} />
                        </Form.Item>

                        <Form.Item
                            label={<Text strong>Status</Text>}
                        >
                            <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
                                <Form.Item name="active" valuePropName="checked" noStyle initialValue={true}>
                                    <Checkbox>Active</Checkbox>
                                </Form.Item>
                            </div>
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={<Text strong>Description</Text>}
                        name="description"
                    >
                        <TextArea
                            placeholder="Briefly explain what this form is for..."
                            rows={3}
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Divider>
                        <Text strong style={{ color: '#1890ff', fontSize: 18 }}>FORM FIELDS</Text>
                    </Divider>

                    <Form.List name="fields">
                        {(fields, { add, remove, move }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Card
                                        key={key}
                                        size="small"
                                        style={{
                                            marginBottom: 24,
                                            borderRadius: 12,
                                            background: '#e6f7ff', // Light Blue background
                                            border: '1px solid #91d5ff',
                                            overflow: 'hidden'
                                        }}
                                        title={
                                            <Space>
                                                <MenuOutlined style={{ color: '#1890ff' }} />
                                                <Text strong style={{ color: '#1890ff' }}>FIELD #{index + 1}</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Space>
                                                <Tooltip title="Move Up">
                                                    <Button
                                                        icon={<ArrowUpOutlined />}
                                                        onClick={() => move(index, index - 1)}
                                                        disabled={index === 0}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Move Down">
                                                    <Button
                                                        icon={<ArrowDownOutlined />}
                                                        onClick={() => move(index, index + 1)}
                                                        disabled={index === fields.length - 1}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => remove(name)}
                                                />
                                            </Space>
                                        }
                                    >
                                        <div style={{ padding: '8px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.5fr 0.5fr', gap: '16px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'label']}
                                                    label="Label"
                                                    rules={[{ required: true, message: 'Label is required' }]}
                                                >
                                                    <Input placeholder="e.g., Department Name" style={{ borderRadius: 6 }} />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'componentType']}
                                                    label="Type"
                                                    rules={[{ required: true, message: 'Type is required' }]}
                                                >
                                                    <Select placeholder="Select type" style={{ borderRadius: 6 }}>
                                                        {componentOptions.map(opt => (
                                                            <Option key={opt.value} value={opt.value}>
                                                                <Space>{opt.icon} {opt.label}</Space>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'required']}
                                                    label="Req."
                                                    valuePropName="checked"
                                                    initialValue={false}
                                                >
                                                    <Checkbox />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Order"
                                                >
                                                    <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>{index + 1}</Tag>
                                                </Form.Item>
                                            </div>


                                        </div>
                                    </Card>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    style={{
                                        height: 48,
                                        borderRadius: 12,
                                        borderStyle: 'dashed',
                                        borderWidth: 2,
                                        color: '#1890ff',
                                        borderColor: '#1890ff'
                                    }}
                                >
                                    Add new field
                                </Button>
                            </>
                        )}
                    </Form.List>
                    <Divider>
                        <Text strong style={{ color: '#52c41a', fontSize: 18 }}>WORKFLOW STEPS</Text>
                    </Divider>

                    <Form.List name="workflowSteps">
                        {(fields, { add, remove, move }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Card
                                        key={key}
                                        size="small"
                                        style={{
                                            marginBottom: 16,
                                            borderRadius: 12,
                                            background: '#f6ffed', // Light Green backround
                                            border: '1px solid #b7eb8f',
                                            overflow: 'hidden'
                                        }}
                                        title={
                                            <Space>
                                                <MenuOutlined style={{ color: '#52c41a' }} />
                                                <Text strong style={{ color: '#52c41a' }}>STEP #{index + 1}</Text>
                                            </Space>
                                        }
                                        extra={
                                            <Space>
                                                <Tooltip title="Move Up">
                                                    <Button
                                                        icon={<ArrowUpOutlined />}
                                                        onClick={() => move(index, index - 1)}
                                                        disabled={index === 0}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Move Down">
                                                    <Button
                                                        icon={<ArrowDownOutlined />}
                                                        onClick={() => move(index, index + 1)}
                                                        disabled={index === fields.length - 1}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => remove(name)}
                                                />
                                            </Space>
                                        }
                                    >
                                        <div style={{ display: 'flex', gap: 16, padding: '8px', alignItems: 'flex-end' }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'managerId']}
                                                label="Manager"
                                                rules={[{ required: true, message: 'Select a manager' }]}
                                                style={{ flex: 1, marginBottom: 0 }}
                                            >
                                                <Select placeholder="Select Manager" style={{ borderRadius: 6 }}>
                                                    {managers.map(manager => (
                                                        <Option key={manager.id} value={manager.id}>
                                                            {manager.fullName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="Order" style={{ marginBottom: 0 }}>
                                                <Tag color="green" style={{ fontSize: 14, padding: '4px 12px', margin: 0 }}>{index + 1}</Tag>
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    style={{ height: 48, borderRadius: 8, color: '#52c41a', borderColor: '#52c41a' }}
                                >
                                    Add Approval Step
                                </Button>
                            </>
                        )}
                    </Form.List>

                    <Divider />

                    <div style={{ marginTop: 48, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                        <Button size="large" onClick={() => navigate(-1)} style={{ borderRadius: 8, padding: '0 32px' }} disabled={loading}>
                            Discard Changes
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            size="large"
                            loading={loading}
                            style={{ borderRadius: 8, padding: '0 40px', height: 48 }}
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CreateTemplatePage;
