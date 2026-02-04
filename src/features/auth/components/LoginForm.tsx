import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../api/login';
import { LoginRequest } from '../types';

const { Title, Text } = Typography;

interface LoginFormProps {
    onSuccess: (token: string, username: string, role: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const response = await login(values);
            message.success('Login successful!');
            onSuccess(response.token, response.username, response.role);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Invalid username or password';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            className="login-card"
            bordered={false}
            style={{
                width: 400,
                borderRadius: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>ESM System</Title>
                <Text type="secondary">Please login to continue</Text>
            </div>

            <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input
                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Username"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Password"
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={{
                            height: 48,
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #1677ff 0%, #003eb3 100%)',
                            border: 'none',
                            marginTop: 12
                        }}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginForm;
