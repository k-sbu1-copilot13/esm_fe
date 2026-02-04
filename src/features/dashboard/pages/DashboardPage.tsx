import React from 'react';
import { Typography, Empty } from 'antd';
import { useAuthStore } from '../../../stores/authStore';
import AdminDashboard from '../components/AdminDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const role = user?.role?.toUpperCase();

    const renderDashboard = () => {
        switch (role) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'MANAGER':
                return <ManagerDashboard />;
            case 'EMPLOYEE':
                return <EmployeeDashboard />;
            default:
                // If role is unknown, maybe default to Employee or show Empty
                return (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <Empty description="User role not identified. Please contact Admin." />
                        <Text type="secondary">Current role: {role || 'Unknown'}</Text>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: '0px' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Electronic Submission Management (ESM)</Title>
                <Text type="secondary">Welcome back, {user?.username} ({role})</Text>
            </div>

            {renderDashboard()}
        </div>
    );
};

export default DashboardPage;
