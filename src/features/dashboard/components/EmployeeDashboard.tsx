import React, { useEffect, useState } from 'react';
import { Table, Typography, Card, Tag, Space, Button, List, message, Skeleton, Input } from 'antd';
import { EditOutlined, DeleteOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getEmployeeTemplates } from '../../templates';
import type { FormTemplate } from '../../templates';

const { Title } = Typography;

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
    const [templates, setTemplates] = useState<FormTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 6;

    const fetchTemplates = async () => {
        setLoadingTemplates(true);
        try {
            const data = await getEmployeeTemplates({
                page: currentPage - 1,
                size: pageSize,
                search: searchText || undefined
            });
            setTemplates(data.content);
            setTotalElements(data.totalElements);
        } catch (error: any) {
            console.error('Failed to fetch templates:', error);
            message.error('Failed to load application forms.');
        } finally {
            setLoadingTemplates(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchText]);

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>List of application forms</Title>
                    <Input
                        placeholder="Search application forms..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ width: 300, borderRadius: 8 }}
                        allowClear
                    />
                </div>
                {loadingTemplates ? (
                    <Skeleton active />
                ) : (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                        dataSource={templates}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalElements,
                            onChange: (page) => setCurrentPage(page),
                            position: 'bottom',
                            align: 'center',
                            size: 'small',
                            hideOnSinglePage: true
                        }}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    size="small"
                                    style={{
                                        borderRadius: 12,
                                        border: '1px solid #f0f0f0',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    bodyStyle={{ flex: 1 }}
                                    actions={[
                                        <Button
                                            type="link"
                                            icon={<FileAddOutlined />}
                                            onClick={() => console.log('Use Form', item.id)}
                                        >
                                            Use Form
                                        </Button>
                                    ]}
                                >
                                    <Card.Meta
                                        title={item.title}
                                        description={
                                            <div style={{ minHeight: 44 }}>
                                                <div style={{ fontSize: 13, color: '#8c8c8c', lineHeight: '22px' }}>
                                                    {item.description}
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
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
