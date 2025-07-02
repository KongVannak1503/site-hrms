import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../components/style/Tap.css';

const EmployeeNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const tabs = [
        { key: 'profile', label: 'Personal Date', path: `/employee/profile/${id}` },
        { key: 'education', label: 'Education', path: `/employee/education/${id}` },
        { key: 'history', label: 'Employment History', path: `/employee/history/${id}` },
        { key: 'document', label: 'Document', path: `/employee/document/${id}` },
        { key: 'nssf', label: 'NSSF', path: `/employee/nssf/${id}` },
    ];

    // Determine current tab based on location.pathname
    const currentTab = tabs.find(tab => location.pathname.startsWith(tab.path));
    const currentTabKey = currentTab?.key || 'profile';

    const onChange = (key) => {
        const selectedTab = tabs.find(tab => tab.key === key);
        if (selectedTab) {
            navigate(selectedTab.path);
        }
    };

    return (
        <div className="employee-tab-bar !bg-white !border-b !border-gray-200">
            <Tabs
                className="!pb-0 !mb-0 custom-tabs"
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
