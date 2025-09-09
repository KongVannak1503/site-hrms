import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../components/style/Tap.css';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeNav = () => {
    const { content } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const tabs = [
        { key: 'profile', label: content['employeeInfo'], path: `/employee/profile/${id}` },
        { key: 'position', label: content['additionalPositions'], path: `/employee/position/${id}` },
        { key: 'education', label: content['education'], path: `/employee/education/${id}` },
        { key: 'history', label: content['employmentHistory'], path: `/employee/history/${id}` },
        { key: 'document', label: content['document'], path: `/employee/document/${id}` },
        { key: 'book', label: content['employeeBook'], path: `/employee/book/${id}` },
        { key: 'law', label: content['contract'], path: `/employee/law/${id}` },
        { key: 'nssf', label: content['nssf'], path: `/employee/nssf/${id}` },
        { key: 'time-line', label: content['seniorityPayment'], path: `/employee/time-line/${id}` },
        // { key: 'appraisal', label: content['appraisal'], path: `/employee/kpi/appraisal/${id}` },
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
