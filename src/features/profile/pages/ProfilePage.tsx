import React, { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Descriptions, Tag, Space, Skeleton, message, Divider } from 'antd';
import { UserOutlined, IdcardOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getUserProfile } from '../api/profile';
import { type UserProfile } from '../types';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                message.error('Failed to load profile information');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Card bordered={false} className="glass-morphism" style={{ borderRadius: 16 }}>
                    <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Card>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ textAlign: 'center', marginTop: 50 }}>
                <Text type="secondary">Failed to load profile. Please try again later.</Text>
            </div>
        );
    }

    const getStatusTag = (status: string) => {
        const isActive = status?.toUpperCase() === 'ACTIVE' || status?.toUpperCase() === 'ENABLED';
        return (
            <Tag
                // icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                color={isActive ? 'green' : 'red'}
                style={{ borderRadius: 12, padding: '0 12px' }}
            >
                {status?.toUpperCase() || 'UNKNOWN'}
            </Tag>
        );
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
            <Card
                bordered={false}
                className="glass-morphism"
                style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    margin: '-24px -24px 24px -24px'
                }}>
                    <Avatar
                        size={120}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#1677ff',
                            marginBottom: 16,
                            boxShadow: '0 4px 12px rgba(22,119,255,0.3)',
                            border: '4px solid white'
                        }}
                    />
                    <Title level={2} style={{ margin: 0 }}>{profile.fullName}</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>@{profile.username}</Text>
                </div>

                <Divider style={{ margin: '24px 0' }} />

                <Descriptions
                    column={1}
                    bordered={false}
                    labelStyle={{ fontWeight: 600, color: '#8c8c8c', width: '150px' }}
                    contentStyle={{ fontSize: 16 }}
                >
                    <Descriptions.Item label={<Space><IdcardOutlined /> Full Name</Space>}>
                        {profile.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><UserOutlined /> Username</Space>}>
                        {profile.username}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><UserOutlined /> Role</Space>}>
                        <Tag color="blue" style={{ borderRadius: 6 }}>{profile.role}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><CheckCircleOutlined /> Status</Space>}>
                        {getStatusTag(profile.status)}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .glass-morphism {
                    transition: all 0.3s ease;
                }
                .glass-morphism:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 48px rgba(0,0,0,0.12);
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
