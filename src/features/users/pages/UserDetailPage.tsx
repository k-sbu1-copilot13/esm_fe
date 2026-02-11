import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Button, Space, Typography, message, Skeleton, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { getUserById, updateUserRoleStatus } from '../api/users';
import { type User } from '../types';

const { Title } = Typography;
const { Option } = Select;

const UserDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getUserById(id);
                setUser(data);
                form.setFieldsValue(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                message.error('Failed to load user details.');
                navigate('/users');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, form, navigate]);

    const onFinish = async (values: { role: string; status: string }) => {
        if (!id) return;
        setSaving(true);
        try {
            await updateUserRoleStatus(id, {
                role: values.role,
                status: values.status
            });
            message.success('User updated successfully');
            navigate('/users');
        } catch (error) {
            console.error('Failed to update user:', error);
            message.error('Failed to update user.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <a onClick={() => navigate('/users')}>User Management</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>User Detail</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                bordered={false}
                className="glass-morphism"
                style={{
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: 600,
                    margin: '0 auto'
                }}
            >
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/users')}
                    />
                    <Title level={3} style={{ margin: 0 }}>User Detail</Title>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={user || {}}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            disabled
                            style={{ borderRadius: 6 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                    >
                        <Input
                            disabled
                            style={{ borderRadius: 6 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select style={{ borderRadius: 6 }}>
                            <Option value="ADMIN">ADMIN</Option>
                            <Option value="MANAGER">MANAGER</Option>
                            <Option value="EMPLOYEE">EMPLOYEE</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select a status' }]}
                    >
                        <Select style={{ borderRadius: 6 }}>
                            <Option value="ACTIVE">ACTIVE</Option>
                            <Option value="LOCKED">LOCKED</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => navigate('/users')} style={{ borderRadius: 6 }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={saving}
                                style={{ borderRadius: 6, padding: '0 24px' }}
                            >
                                Save Changes
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .glass-morphism {
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                }
            `}</style>
        </div>
    );
};

export default UserDetailPage;
