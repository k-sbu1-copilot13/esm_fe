import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Typography, Card, Tag, Space, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getPendingApprovals, getApprovalHistory } from '../../approvals';
import type { PendingApproval, ApprovalHistory } from '../../approvals';

const { Title } = Typography;

const ManagerDashboard: React.FC = () => {
    const navigate = useNavigate();

    // Awaiting state
    const [awaitingData, setAwaitingData] = useState<PendingApproval[]>([]);
    const [loadingAwaiting, setLoadingAwaiting] = useState(false);
    const [awaitingPage, setAwaitingPage] = useState(1);
    const [awaitingTotal, setAwaitingTotal] = useState(0);
    const [awaitingSearch, setAwaitingSearch] = useState('');
    const pageSize = 5;

    // Processed state
    const [processedData, setProcessedData] = useState<ApprovalHistory[]>([]);
    const [loadingProcessed, setLoadingProcessed] = useState(false);
    const [processedPage, setProcessedPage] = useState(1);
    const [processedTotal, setProcessedTotal] = useState(0);
    const [processedSearch, setProcessedSearch] = useState('');

    const fetchPendingApprovals = async () => {
        setLoadingAwaiting(true);
        try {
            const data = await getPendingApprovals({
                page: awaitingPage - 1,
                size: pageSize,
                search: awaitingSearch || undefined
            });
            setAwaitingData(data.content);
            setAwaitingTotal(data.totalElements);
        } catch (error) {
            console.error('Failed to fetch pending approvals:', error);
            message.error('Failed to load pending applications');
        } finally {
            setLoadingAwaiting(false);
        }
    };

    const fetchApprovalHistory = async () => {
        setLoadingProcessed(true);
        try {
            const data = await getApprovalHistory({
                page: processedPage - 1,
                size: pageSize,
                search: processedSearch || undefined
            });
            setProcessedData(data.content);
            setProcessedTotal(data.totalElements);
        } catch (error) {
            console.error('Failed to fetch approval history:', error);
            message.error('Failed to load processed applications');
        } finally {
            setLoadingProcessed(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPendingApprovals();
        }, 300);
        return () => clearTimeout(timer);
    }, [awaitingPage, awaitingSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchApprovalHistory();
        }, 300);
        return () => clearTimeout(timer);
    }, [processedPage, processedSearch]);

    const awaitingColumns: ColumnsType<PendingApproval> = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 80,
            render: (_text, _record, index) => (awaitingPage - 1) * pageSize + index + 1
        },
        { title: 'Title', dataIndex: 'templateTitle', key: 'templateTitle', render: (text) => text || 'Untitled' },
        { title: 'Employee name', dataIndex: 'employeeName', key: 'employeeName' },
        {
            title: 'Submit at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => date ? new Date(date).toLocaleString('vi-VN') : 'N/A'
        },
    ];

    const processedColumns: ColumnsType<ApprovalHistory> = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 80,
            render: (_text, _record, index) => (processedPage - 1) * pageSize + index + 1
        },
        { title: 'Title', dataIndex: 'templateTitle', key: 'templateTitle', render: (text) => text || 'Untitled' },
        { title: 'Employee name', dataIndex: 'employeeName', key: 'employeeName' },
        {
            title: 'Processed at',
            dataIndex: 'actedAt',
            key: 'actedAt',
            render: (date: string) => date ? new Date(date).toLocaleString('vi-VN') : 'N/A'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => {
                let color = 'default';
                if (action === 'APPROVE' || action === 'APPROVED') color = 'green';
                if (action === 'REJECT' || action === 'REJECTED') color = 'red';
                return (
                    <Tag color={color}>
                        {(action || '').toUpperCase()}
                    </Tag>
                );
            }
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>Application awaiting approval</Title>
                    <Input
                        placeholder="Search application awaiting approval..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => {
                            setAwaitingSearch(e.target.value);
                            setAwaitingPage(1);
                        }}
                        style={{ width: 350, borderRadius: 8 }}
                        allowClear
                    />
                </div>
                <Table
                    columns={awaitingColumns}
                    dataSource={awaitingData}
                    rowKey="id"
                    loading={loadingAwaiting}
                    onRow={(record) => ({
                        onClick: () => {
                            const subId = record.submissionId || record.id;
                            const empId = record.employeeId;
                            console.log('Navigating to submission detail:', { subId, empId, Record: record });
                            navigate(`/submissions/approve/${subId}?employeeId=${empId}`);
                        },
                        style: { cursor: 'pointer' }
                    })}
                    pagination={{
                        current: awaitingPage,
                        pageSize: pageSize,
                        total: awaitingTotal,
                        onChange: (page) => setAwaitingPage(page),
                        hideOnSinglePage: true,
                        size: 'small'
                    }}
                    size="middle"
                />
            </Card>

            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>List of processed applications</Title>
                    <Input
                        placeholder="Search processed applications..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        onChange={(e) => {
                            setProcessedSearch(e.target.value);
                            setProcessedPage(1);
                        }}
                        style={{ width: 350, borderRadius: 8 }}
                        allowClear
                    />
                </div>
                <Table
                    columns={processedColumns}
                    dataSource={processedData}
                    rowKey="id"
                    loading={loadingProcessed}
                    onRow={(record) => ({
                        onClick: () => {
                            const subId = record.submissionId;
                            const logId = record.id;
                            console.log('Navigating to processed submission detail:', { subId, logId, Record: record });
                            navigate(`/submissions/approve/${subId}?isViewOnly=true&logId=${logId}`);
                        },
                        style: { cursor: 'pointer' }
                    })}
                    pagination={{
                        current: processedPage,
                        pageSize: pageSize,
                        total: processedTotal,
                        onChange: (page) => setProcessedPage(page),
                        hideOnSinglePage: true,
                        size: 'small'
                    }}
                    size="middle"
                />
            </Card>
        </Space>
    );
};

export default ManagerDashboard;
