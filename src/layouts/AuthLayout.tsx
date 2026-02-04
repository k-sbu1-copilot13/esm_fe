import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content, Footer } = Layout;

const AuthLayout: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
                zIndex: 0,
            }} />
            <Content style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
                zIndex: 1,
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <Outlet />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center', background: 'transparent', zIndex: 1, color: 'rgba(255,255,255,0.65)' }}>
                ESM System ©{new Date().getFullYear()} Created by Antigravity
            </Footer>
        </Layout>
    );
};

export default AuthLayout;
