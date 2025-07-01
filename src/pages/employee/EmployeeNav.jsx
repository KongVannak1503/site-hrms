import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../components/style/Tap.css'

const EmployeeNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, section } = useParams();

    const tabs = [
        { key: 'profile', label: 'Profile' },
        { key: 'education', label: 'Education' },
        { key: 'training', label: 'Training' },
        { key: 'languages', label: 'Languages' },
        { key: 'history', label: 'History' },
        { key: 'exact-post', label: 'Exact Post' },
        { key: 'reference', label: 'Reference' },
    ];

    const currentTabKey = section || 'profile';

    const onChange = (key) => {
        navigate(`/employee/${key}/${id}`);
    };

    return (
        <div
            className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5"
            style={{
                position: 'fixed',
                top: 56,
                width: '100%',
                zIndex: 10,
            }}
        >
            <Tabs
                className="!pb-0 !mb-0"
                style={{ marginBottom: 0 }}
                activeKey={currentTabKey}
                onChange={onChange}
                items={tabs.map(tab => ({
                    key: tab.key,
                    label: tab.label,
                }))}
            />
        </div>
    );
};

export default EmployeeNav;
