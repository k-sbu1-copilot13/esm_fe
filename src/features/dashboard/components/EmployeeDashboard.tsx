import React from 'react';
import { Table, Typography, Card, Tag, Space, Button, List } from 'antd';
import { EditOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ApplicationForm {
    id: string;
    no: number;
    title: string;
}

interface DraftData {
    key: string;
    no: number;
    title: string;
}

interface SubmittedData {
    key: string;
    no: number;
    title: string;
    submitAt: string;
    status: string;
    currentStep: string;
}

const EmployeeDashboard: React.FC = () => {
    const formList: ApplicationForm[] = [
        { id: '1', no: 1, title: 'Annual Leave Request Form' },
        { id: '2', no: 2, title: 'Overtime Claim Form' },
        { id: '3', no: 3, title: 'Business Trip Request' },
    ];

    const draftColumns: ColumnsType<DraftData> = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => console.log('Edit Draft', record.key)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => console.log('Delete Draft', record.key)} />
                </Space>
            ),
        },
    ];

    const submittedColumns: ColumnsType<SubmittedData> = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Submit at', dataIndex: 'submitAt', key: 'submitAt' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        { title: 'Current Step', dataIndex: 'currentStep', key: 'currentStep' },
    ];

    const draftData: DraftData[] = [
        { key: '1', no: 1, title: 'Summer Vacation Request' },
    ];

    const submittedData: SubmittedData[] = [
        {
            key: '1',
            no: 1,
            title: 'Overtime Jan 2026',
            submitAt: '2026-01-20 14:00',
            status: 'Approved',
            currentStep: 'Completed',
        },
        {
            key: '2',
            no: 2,
            title: 'Annual Leave - Feb',
            submitAt: '2026-02-04 10:00',
            status: 'Pending',
            currentStep: 'Line Manager Review',
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <Title level={4} style={{ marginBottom: 20 }}>List of application forms</Title>
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={formList}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                size="small"
                                style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
                                actions={[<Button type="link" icon={<FileAddOutlined />}>Use Form</Button>]}
                            >
                                <Card.Meta
                                    title={`Form #${item.no}`}
                                    description={item.title}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>

            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <Title level={4} style={{ marginBottom: 20 }}>Draft application list</Title>
                <Table columns={draftColumns} dataSource={draftData} pagination={false} size="middle" />
            </Card>

            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <Title level={4} style={{ marginBottom: 20 }}>List of submitted applications</Title>
                <Table columns={submittedColumns} dataSource={submittedData} pagination={{ pageSize: 5 }} size="middle" />
            </Card>
        </Space>
    );
};

export default EmployeeDashboard;
