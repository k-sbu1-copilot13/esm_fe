import React from 'react';
import { Table, Button, Space, Typography, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ApplicationData {
    key: string;
    no: number;
    title: string;
    createdAt: string;
    status: string;
}

const AdminDashboard: React.FC = () => {
    const columns: ColumnsType<ApplicationData> = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 80,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'gold'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => console.log('Edit', record.key)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => console.log('Delete', record.key)} />
                </Space>
            ),
        },
    ];

    const data: ApplicationData[] = [
        {
            key: '1',
            no: 1,
            title: 'Annual Leave Request Form',
            createdAt: '2026-02-01',
            status: 'Active',
        },
        {
            key: '2',
            no: 2,
            title: 'Overtime Claim Form',
            createdAt: '2026-02-02',
            status: 'Active',
        },
        {
            key: '3',
            no: 3,
            title: 'Business Trip Request',
            createdAt: '2026-02-03',
            status: 'Inactive',
        },
    ];

    return (
        <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>List of applications</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ borderRadius: 8 }}
                >
                    Create a new application form
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                style={{ borderRadius: 8 }}
            />
        </Card>
    );
};

export default AdminDashboard;
