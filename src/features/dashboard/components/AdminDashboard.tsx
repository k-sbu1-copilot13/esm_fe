import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Tag, message, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getAdminTemplates } from '../../templates';
import type { FormTemplate } from '../../templates';
import dayjs from 'dayjs';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
    const [templates, setTemplates] = useState<FormTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const fetchTemplates = async (page: number, size: number, search: string) => {
        setLoading(true);
        try {
            const response = await getAdminTemplates({
                page: page - 1,
                size: size,
                search: search || undefined,
                sort: 'createdAt,desc'
            });
            setTemplates(response.content);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: size,
                total: response.totalElements,
            }));
        } catch (error: any) {
            console.error('Failed to fetch templates:', error);
            message.error('Failed to load form templates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates(1, pagination.pageSize, searchText);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText]);

    const handleTableChange = (newPagination: any) => {
        fetchTemplates(newPagination.current, newPagination.pageSize, searchText);
    };

    const columns: ColumnsType<FormTemplate> = [
        {
            title: 'No',
            key: 'no',
            width: 80,
            render: (_text, _record, index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            render: (active: boolean) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => console.log('Edit', record.id)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => console.log('Delete', record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>List of applications</Title>
                <Space size="middle">
                    <Input
                        placeholder="Search templates..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250, borderRadius: 8 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ borderRadius: 8 }}
                    >
                        Create a new application form
                    </Button>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={templates}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                }}
                onChange={handleTableChange}
                style={{ borderRadius: 8 }}
            />
        </Card>
    );
};

export default AdminDashboard;
