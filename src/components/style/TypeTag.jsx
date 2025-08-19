import { Tag } from 'antd';

const TypeTag = ({ value }) => {
    const isActive = Boolean(value); // Convert to boolean if needed
    const color = isActive ? '#002060' : 'volcano';
    const label = isActive ? 'Complete' : 'Inprogress';

    return <Tag color={color}>{label}</Tag>;
};

export default TypeTag;
