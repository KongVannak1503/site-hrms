import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    AppstoreOutlined,
    SettingOutlined,
    AudioOutlined,
} from '@ant-design/icons';
import { LuChartNoAxesCombined, LuClipboardPen, LuUsers } from "react-icons/lu";
import { Menu } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/log_usea.png';
import { useAuth } from '../../contexts/AuthContext';

const AppSider = ({ collapsed }) => {
    const { content, identity, isEmployee } = useAuth();

    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const permissions = identity?.role?.permissions || [];

    // Check if permission allows "view"
    const canView = (permissionName) => {
        if (!permissionName) return false;
        return permissions.some(
            p => p.permissionId?.name === permissionName && p.actions.includes('view')
        );
    };
    const hasAdminView = identity?.role.permissions.some(
        perm =>
            perm.permissionId.name === 'admin' &&
            perm.actions.includes('view') &&
            perm.isActive
    );
    // Recursively filter items based on permissions
    const filterItemsByPermissions = (items) => {
        return items
            .map(item => {
                if (item.key === '/') return item;
                if (item.children) {
                    const filteredChildren = filterItemsByPermissions(item.children);

                    // keep parent if it has children left OR its own permission
                    if (filteredChildren.length > 0 || canView(item.permission)) {
                        return { ...item, children: filteredChildren };
                    }
                    return null; // remove parent
                }

                // leaf node → check permission
                return canView(item.permission) ? item : null;
            })
            .filter(Boolean); // remove null items
    };


    // Determine selected menu key based on current URL
    const getSelectedKey = (pathname) => {
        if (pathname.startsWith('/employee')) return '/employee';
        if (pathname.startsWith('/appraisal/day/')) return '/appraisal/day/employee';
        if (pathname.startsWith('/appraisal/day/employee')) return '/appraisal/day';
        if (pathname.startsWith('/appraisal/kpi')) return '/appraisal/kpi';
        if (pathname.startsWith('/appraisal/employee')) return '/appraisal/employee';
        if (pathname.startsWith('/appraisal/month')) return '/appraisal/employee';
        if (pathname.startsWith('/payroll/')) return '/payroll';
        if (pathname.startsWith('/applicants/')) return '/applicants';
        if (pathname.startsWith('/job-postings/')) return '/job-postings';
        return pathname;
    };

    // Sidebar menu items with keys (URL) and permission names
    const employeeItems = [
        { key: '/', icon: <AppstoreOutlined />, label: content['dashboard'] },
        {
            key: '/recruiter', permission: null, icon: <VideoCameraOutlined />, label: content['recruiter'],
            children: [
                { key: '/job-postings', permission: 'job-postings', label: content['jobPostings'] },
                { key: '/applicants', permission: 'applicants', label: content['applicants'] },
                { key: '/test-schedules', permission: 'test-schedules', label: content['testSchedule'] },
                { key: '/interview-schedules', permission: 'interview-schedules', label: content['interviewSchedule'] },
            ]
        },
        isEmployee
            ? {
                key: '/employees',
                permission: null,
                icon: <LuUsers />,
                label: content['employees'],
                children: [
                    { key: '/employee', permission: 'employees', label: content['employee'] },
                    { key: '/payroll', permission: 'seniority-payment', label: content['seniorityPayment'] },
                ],
            }
            : {
                key: `/employee/view/${identity?.employeeId._id}`,
                permission: 'employees',
                icon: <LuUsers />,
                label: content['employee'],
            },
        {
            key: '/appraisals', permission: null, icon: <LuClipboardPen />, label: content['appraisal'],
            children: [
                { key: '/appraisal/kpi', permission: 'kpi', label: content['kpi'] },
                { key: '/appraisal/recently', permission: 'appraisal-recently', label: content['appraisalList'] || 'Recently Appraisal' },
                {
                    key: hasAdminView
                        ? '/appraisal/employee'
                        : isEmployee
                            ? '/appraisal/employee/path'
                            : `/appraisal/employee/list/path/${identity?.employeeId?._id}`,
                    permission: 'appraisals-employee',
                    label: isEmployee ? content['employees'] : content['myAppraisal'],
                },
                { key: '/appraisal', permission: 'appraisals', label: content['appraisal'] },
            ]
        },
        {
            key: '/reports', permission: null, icon: <LuChartNoAxesCombined />, label: content['report'],
            children: [
                { key: '/report/recruitment', permission: 'reports', label: `${content['recruiter']}` },
                { key: '/report/employee', permission: 'reports', label: `${content['employee']}` },
                { key: '/report/appraisal', permission: 'reports', label: `${content['appraisal']}` },
            ]
        },
        {
            key: '/settings', permission: "setting", icon: <SettingOutlined />, label: content['settings'], children: [
                {
                    key: '/setting/user', permission: "setting", label: `${content['user']} & ${content['role']}`, children: [
                        { key: '/setting/user/index', permission: "setting", label: content['users'] },
                        { key: '/setting/user/role', permission: "setting", label: content['roles'] },
                    ]
                },
                { key: '/setting/employee/level', permission: "setting", label: content['level'] },
                { key: '/setting/employee/city', permission: "setting", label: content['province'] },
                { key: '/setting/positions', permission: "setting", label: content['positions'] },
                { key: '/setting/job-types', permission: "setting", label: content['jobType'] },
                { key: '/setting/departments', permission: "setting", label: content['departments'] },
                { key: '/setting/test-types', permission: "setting", label: content['testType'] },
                // { key: '/setting/organization', permission: "setting", label: content['organizations'] },
            ],
        },
    ];

    return (
        <>
            {/* Logo section */}
            <div style={{ textAlign: 'center', padding: '10px 16px 16px' }}>
                <img
                    src={Logo}
                    alt="Logo"
                    className='mx-auto'
                    style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain', cursor: 'pointer' }}
                    onClick={() => navigate("/")}
                />
            </div>

            {/* Sidebar Menu */}
            <Menu
                theme='light'
                mode="inline"
                selectedKeys={[getSelectedKey(location.pathname)]}
                onClick={(e) => navigate(e.key)}
                items={filterItemsByPermissions(employeeItems)}
            />
        </>
    );
};

export default AppSider;
