import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Typography, Card, Tag, Space, Input, message } from 'antd';
import { SearchOutlined, UserOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getUsers } from '../api/users';
import { type User } from '../types';

const { Title } = Typography;

const UserManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers({
                page: currentPage - 1,
                size: pageSize,
                search: searchText || undefined
            });
            setUsers(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            message.error('Failed to load users list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchText]);

    const columns: ColumnsType<User> = [
        {
            title: 'No',
            key: 'no',
            width: 70,
            align: 'center',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color="geekblue" style={{ borderRadius: 4 }}>{role}</Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const isActive = status?.toUpperCase() === 'ACTIVE' || status?.toUpperCase() === 'ENABLED';
                const isLocked = status?.toUpperCase() === 'LOCKED';
                return (
                    <Tag
                        icon={isActive ? <CheckCircleOutlined /> : isLocked ? <StopOutlined /> : <StopOutlined />}
                        color={isActive ? 'green' : isLocked ? 'red' : 'default'}
                        style={{ borderRadius: 12, padding: '0 8px' }}
                    >
                        {status?.toUpperCase() || 'UNKNOWN'}
                    </Tag>
                );
            }
        },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <Card
                bordered={false}
                className="glass-morphism"
                style={{
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    background: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24
                }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>User Management</Title>
                        <Typography.Text type="secondary">Manage system users and their roles</Typography.Text>
                    </div>
                    <Input
                        placeholder="Search users by name or username..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ width: 350, borderRadius: 8, height: 40 }}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalElements,
                        onChange: (page) => setCurrentPage(page),
                        position: ['bottomCenter'],
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} users`,
                    }}
                    rowClassName="table-row-hover"
                    style={{ borderRadius: 8, overflow: 'hidden' }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/users/${record.id}`),
                    })}
                />
            </Card>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .table-row-hover:hover {
                    background-color: #fafafa;
                    cursor: pointer;
                }
                .glass-morphism {
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                }
            `}</style>
        </div>
    );
};

export default UserManagementPage;
