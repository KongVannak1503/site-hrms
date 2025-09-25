import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../components/style/Tap.css';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeNav = () => {
    const { content, identity } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const employeePermission = identity?.role?.permissions?.find(
        p => p.permissionId?.name === "employees"
    );
    // ✅ Extract its actions (or empty array if not found)
    const allowedActions = employeePermission?.actions || [];

    const permissionMap = allowedActions.reduce((acc, action) => {
        acc[action] = true;
        return acc;
    }, {});

    const tabs = [
        { key: 'profile', label: content['employeeInfo'], path: `/employee/profile/${id}`, permissionKey: 'update' },
        { key: 'position', label: content['additionalPositions'], path: `/employee/position/${id}`, permissionKey: 'additional-position' },
        { key: 'education', label: content['education'], path: `/employee/education/${id}`, permissionKey: "education" },
        { key: 'history', label: content['employmentHistory'], path: `/employee/history/${id}`, permissionKey: "employee-history" },
        { key: 'document', label: content['document'], path: `/employee/document/${id}`, permissionKey: "document" },
        { key: 'book', label: content['employeeBook'], path: `/employee/book/${id}`, permissionKey: "employee-book" },
        { key: 'law', label: content['contract'], path: `/employee/law/${id}`, permissionKey: "contract" },
        { key: 'nssf', label: content['nssf'], path: `/employee/nssf/${id}`, permissionKey: "nssf" },
        { key: 'time-line', label: content['seniorityPayment'], path: `/employee/time-line/${id}`, permissionKey: "seniority-payment" },
        // { key: 'appraisal', label: content['appraisal'], path: `/employee/kpi/appraisal/${id}` },
    ];

    const visibleTabs = tabs.filter(tab => permissionMap[tab.permissionKey]);

    // Determine current tab based on location.pathname
    // const currentTab = tabs.find(tab => location.pathname.startsWith(tab.path));
    // const currentTabKey = currentTab?.key || 'profile';
    const currentTab = visibleTabs.find(tab => location.pathname.startsWith(tab.path));
    const currentTabKey = currentTab?.key || visibleTabs[0]?.key;

    const onChange = (key) => {
        const selectedTab = visibleTabs.find(tab => tab.key === key);
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
                items={visibleTabs.map(tab => ({
                    key: tab.key,
                    label: tab.label,
                }))}
            />
        </div>
    );
};

export default EmployeeNav;
