import { Tag } from 'antd';

const StatusTag = ({ value }) => {
    const isActive = Boolean(value); // Convert to boolean if needed
    const color = isActive ? '#0b9ab0' : 'volcano';
    const label = isActive ? 'ACTIVE' : 'INACTIVE';

    return <Tag color={color}>{label}</Tag>;
};

export default StatusTag;
