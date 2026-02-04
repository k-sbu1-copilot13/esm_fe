import React from 'react';
import { Table, Typography, Card, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface AwaitingData {
    key: string;
    no: number;
    title: string;
    employeeName: string;
    submitAt: string;
}

interface ProcessedData extends AwaitingData {
    status: string;
}

const ManagerDashboard: React.FC = () => {
    const awaitingColumns: ColumnsType<AwaitingData> = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Employee name', dataIndex: 'employeeName', key: 'employeeName' },
        { title: 'Submit at', dataIndex: 'submitAt', key: 'submitAt' },
    ];

    const processedColumns: ColumnsType<ProcessedData> = [
        { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Employee name', dataIndex: 'employeeName', key: 'employeeName' },
        { title: 'Submit at', dataIndex: 'submitAt', key: 'submitAt' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Approved' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
    ];

    const awaitingData: AwaitingData[] = [
        {
            key: '1',
            no: 1,
            title: 'Annual Leave - Nguyen Van A',
            employeeName: 'Nguyen Van A',
            submitAt: '2026-02-04 09:00',
        },
    ];

    const processedData: ProcessedData[] = [
        {
            key: '1',
            no: 1,
            title: 'Overtime Claim - Tran Thi B',
            employeeName: 'Tran Thi B',
            submitAt: '2026-02-03 15:30',
            status: 'Approved',
        },
        {
            key: '2',
            no: 2,
            title: 'Business Trip - Le Van C',
            employeeName: 'Le Van C',
            submitAt: '2026-02-02 10:15',
            status: 'Rejected',
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <Title level={4} style={{ marginBottom: 20 }}>Application awaiting approval</Title>
                <Table columns={awaitingColumns} dataSource={awaitingData} pagination={false} size="middle" />
            </Card>

            <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                <Title level={4} style={{ marginBottom: 20 }}>List of processed applications</Title>
                <Table columns={processedColumns} dataSource={processedData} pagination={{ pageSize: 5 }} size="middle" />
            </Card>
        </Space>
    );
};

export default ManagerDashboard;
