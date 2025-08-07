import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../../components/style/Tap.css';
import { useAuth } from '../../../contexts/AuthContext';

const AppraisalNav = () => {
    const { content } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { mainId, id } = useParams();

    const tabs = [
        { key: 'profile', label: content['admin'] || 'Admin', path: `/appraisal/month/admin/${mainId}/form/${id}` },
        { key: 'position', label: content['manager'] || 'Manager', path: `/appraisal/month/manager/${mainId}/form/${id}` },
        { key: 'education', label: content['employees'], path: `/appraisal/month/employee/${mainId}/form/${id}` }
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

export default AppraisalNav;
