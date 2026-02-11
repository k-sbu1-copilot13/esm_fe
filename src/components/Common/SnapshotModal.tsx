import React from 'react';
import { Modal, List, Typography, Empty } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import type { SubmissionValue } from '../../features/submissions/types';

const { Text } = Typography;

interface SnapshotModalProps {
    visible: boolean;
    onClose: () => void;
    data: SubmissionValue[] | undefined;
    title: string;
}

const SnapshotModal: React.FC<SnapshotModalProps> = ({ visible, onClose, data, title }) => {
    return (
        <Modal
            title={
                <span>
                    <HistoryOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    {title}
                </span>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            bodyStyle={{ padding: '12px 24px 24px' }}
        >
            {!data || data.length === 0 ? (
                <Empty description="No data captured in this snapshot" />
            ) : (
                <List
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item style={{ padding: '12px 0' }}>
                            <div style={{ width: '100%' }}>
                                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                                    {item.label}
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {item.value || <Text type="secondary" italic>Empty</Text>}
                                </Text>
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
};

export default SnapshotModal;
