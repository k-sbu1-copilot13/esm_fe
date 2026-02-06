import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Typography, Card, Tag, Space, Button, List, message, Skeleton, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getEmployeeTemplates } from '../../templates';
import type { FormTemplate } from '../../templates';
import { getDraftSubmissions, getSubmittedSubmissions, deleteSubmission } from '../../submissions';
import type { SaveDraftResponse } from '../../submissions';
import { useAuthStore } from '../../../store/authStore';

const { Title, Paragraph } = Typography;

// Using SaveDraftResponse from API as DraftData
type DraftData = SaveDraftResponse & { key: string; no: number; };

// Using SaveDraftResponse from API as SubmittedData (same structure)
type SubmittedData = SaveDraftResponse & { key: string; no: number; };

const EmployeeDashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [templates, setTemplates] = useState<FormTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 6;

    // Draft-related state
    const [drafts, setDrafts] = useState<DraftData[]>([]);
    const [loadingDrafts, setLoadingDrafts] = useState(false);
    const [draftSearchText, setDraftSearchText] = useState('');
    const [draftCurrentPage, setDraftCurrentPage] = useState(1);
    const [draftTotalElements, setDraftTotalElements] = useState(0);
    const draftPageSize = 5;

    // Submitted-related state
    const [submitted, setSubmitted] = useState<SubmittedData[]>([]);
    const [loadingSubmitted, setLoadingSubmitted] = useState(false);
    const [submittedSearchText, setSubmittedSearchText] = useState('');
    const [submittedCurrentPage, setSubmittedCurrentPage] = useState(1);
    const [submittedTotalElements, setSubmittedTotalElements] = useState(0);
    const submittedPageSize = 5;

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

    const fetchDrafts = async () => {
        if (!user?.id) {
            console.warn('User not logged in, skipping draft fetch');
            return;
        }

        setLoadingDrafts(true);
        try {
            const data = await getDraftSubmissions(user.id, {
                page: draftCurrentPage - 1,
                size: draftPageSize,
                search: draftSearchText || undefined
            });
            // Add key and no to each draft
            const draftsWithKeys = data.content.map((draft, index) => ({
                ...draft,
                key: draft.id.toString(),
                no: (draftCurrentPage - 1) * draftPageSize + index + 1
            }));
            setDrafts(draftsWithKeys);
            setDraftTotalElements(data.totalElements);
        } catch (error: any) {
            console.error('Failed to fetch drafts:', error);
            message.error('Failed to load draft applications.');
        } finally {
            setLoadingDrafts(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchText]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDrafts();
        }, 300);
        return () => clearTimeout(timer);
    }, [draftCurrentPage, draftSearchText]);

    const fetchSubmitted = async () => {
        if (!user?.id) {
            console.warn('User not logged in, skipping submitted fetch');
            return;
        }

        setLoadingSubmitted(true);
        try {
            const data = await getSubmittedSubmissions(user.id, {
                page: submittedCurrentPage - 1,
                size: submittedPageSize,
                search: submittedSearchText || undefined
            });
            // Add key and no to each submission
            const submittedWithKeys = data.content.map((submission, index) => ({
                ...submission,
                key: submission.id.toString(),
                no: (submittedCurrentPage - 1) * submittedPageSize + index + 1
            }));
            setSubmitted(submittedWithKeys);
            setSubmittedTotalElements(data.totalElements);
        } catch (error: any) {
            console.error('Failed to fetch submitted applications:', error);
            message.error('Failed to load submitted applications.');
        } finally {
            setLoadingSubmitted(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSubmitted();
        }, 300);
        return () => clearTimeout(timer);
    }, [submittedCurrentPage, submittedSearchText]);

    const handleDeleteDraft = async (id: number) => {
        if (!user?.id) return;

        try {
            await deleteSubmission(id, user.id);
            message.success('Draft deleted successfully');
            fetchDrafts(); // Refresh the list
        } catch (error: any) {
            console.error('Failed to delete draft:', error);
            message.error('Failed to delete draft application.');
        }
    };

    const draftColumns: ColumnsType<DraftData> = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
        {
            title: 'Title',
            dataIndex: 'templateTitle',
            key: 'templateTitle'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/submissions/edit/${record.id}`)}
                    />
                    <Popconfirm
                        title="Delete Draft"
                        description="Are you sure you want to delete this draft?"
                        onConfirm={() => handleDeleteDraft(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const submittedColumns: ColumnsType<SubmittedData> = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
        {
            title: 'Title',
            dataIndex: 'templateTitle',
            key: 'templateTitle'
        },
        {
            title: 'Submit at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'PENDING' ? 'orange' : status === 'APPROVED' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Current Step',
            dataIndex: 'currentStep',
            key: 'currentStep',
            render: (step: number) => `Step ${step}`
        },
    ];

    // Submitted data is now fetched from API and stored in submitted state

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
                                            onClick={() => navigate(`/submissions/use/${item.id}`)}
                                        >
                                            Use Form
                                        </Button>
                                    ]}
                                >
                                    <Card.Meta
                                        title={item.title}
                                        description={
                                            <Paragraph
                                                ellipsis={{ rows: 2, tooltip: item.description }}
                                                style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 0, minHeight: 44 }}
                                            >
                                                {item.description}
                                            </Paragraph>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>Draft application list</Title>
                    <Input
                        placeholder="Search drafts..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => {
                            setDraftSearchText(e.target.value);
                            setDraftCurrentPage(1);
                        }}
                        style={{ width: 250, borderRadius: 8 }}
                        allowClear
                    />
                </div>
                {loadingDrafts ? (
                    <Skeleton active />
                ) : (
                    <Table
                        columns={draftColumns}
                        dataSource={drafts}
                        pagination={{
                            current: draftCurrentPage,
                            pageSize: draftPageSize,
                            total: draftTotalElements,
                            onChange: (page) => setDraftCurrentPage(page),
                            position: ['bottomCenter'],
                            size: 'small',
                            showSizeChanger: false,
                            hideOnSinglePage: true
                        }}
                        size="middle"
                        locale={{
                            emptyText: 'No draft applications'
                        }}
                    />
                )}
            </Card>

            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>List of submitted applications</Title>
                    <Input
                        placeholder="Search submitted applications..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => {
                            setSubmittedSearchText(e.target.value);
                            setSubmittedCurrentPage(1);
                        }}
                        style={{ width: 300, borderRadius: 8 }}
                        allowClear
                    />
                </div>
                {loadingSubmitted ? (
                    <Skeleton active />
                ) : (
                    <Table
                        columns={submittedColumns}
                        dataSource={submitted}
                        pagination={{
                            current: submittedCurrentPage,
                            pageSize: submittedPageSize,
                            total: submittedTotalElements,
                            onChange: (page) => setSubmittedCurrentPage(page),
                            position: ['bottomCenter'],
                            size: 'small',
                            showSizeChanger: false,
                            hideOnSinglePage: true
                        }}
                        size="middle"
                        locale={{
                            emptyText: 'No submitted applications'
                        }}
                    />
                )}
            </Card>
        </Space>
    );
};

export default EmployeeDashboard;
