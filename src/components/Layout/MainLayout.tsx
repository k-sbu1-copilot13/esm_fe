import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Typography, Avatar, Dropdown, App } from 'antd';
import type { MenuProps } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const { message } = App.useApp();

    const handleLogout = () => {
        logout();
        message.success('Logged out successfully');
        navigate('/login');
    };

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/submissions',
            icon: <FileTextOutlined />,
            label: 'My Submissions',
        },
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const userMenuItems: MenuProps = {
        items: [
            {
                key: 'profile',
                label: 'Hồ sơ',
                icon: <UserOutlined />,
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: <LogoutOutlined />,
                danger: true,
                onClick: handleLogout,
            },
        ],
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
                style={{
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    zIndex: 10,
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    {!collapsed && <Title level={4} style={{ margin: 0, color: '#1677ff' }}>ESM SYSTEM</Title>}
                    {collapsed && <DashboardOutlined style={{ fontSize: 24, color: '#1677ff' }} />}
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ borderRight: 0, marginTop: 8 }}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingRight: 24,
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, lineHeight: '20px' }}>{user?.username || 'User'}</div>
                            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', lineHeight: '16px' }}>{user?.role || 'Staff'}</div>
                        </div>
                        <Dropdown menu={userMenuItems} placement="bottomRight" arrow>
                            <Avatar
                                style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
                                icon={<UserOutlined />}
                            />
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'initial',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
