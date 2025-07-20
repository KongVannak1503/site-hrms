import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    AppstoreOutlined,
    SettingOutlined,
    SearchOutlined,
    AudioOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons'
import { LuChartNoAxesCombined, LuClipboardPen, LuGift, LuUsers } from "react-icons/lu";
import { AutoComplete, Input, Menu } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../assets/log_usea.png';
import LogoTitle from '../../assets/usea-title-1.png';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';
const { Search } = Input;

const AppSider = ({ collapsed }) => {
    const { content } = useAuth();
    const [options, setOptions] = useState([]);
    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate()
    const location = useLocation()

    const employeeItems = [
        {
            key: '/',
            icon: <AppstoreOutlined />,
            label: content['dashboard'],
        },
        {
            key: 'recruiter',
            icon: <VideoCameraOutlined />,
            label: content['recruiter'],
            children: [
                { key: '/job-postings', label: content['jobPostings'] },
                { key: '/applicants', label: content['applicants'] },
                { key: '/test-schedules', label: content['testSchedule'] },
                { key: '/interview-schedules', label: content['interviewSchedule'] },
                { key: '/test-types', label: content['testType'] },

            ],
        },
        {
            key: '/employees',
            icon: <LuUsers />,
            label: content['employees'],
            children: [
                { key: '/employee', label: content['employee'] },
                { key: '/payroll', label: content['payroll'] },
            ]
        },
        {
            key: '/appraisals',
            icon: <LuClipboardPen />,
            label: content['appraisal'],
            children: [
                { key: '/appraisal', label: "វាយតម្លៃការងារបណ្ដោះអាសន្ន" },
                { key: '/payroll', label: "វាយតម្លៃការងារប្រចាំថ្ងៃ" },
                { key: '/payroll', label: "វាយតម្លៃការងារប្រចាំខែ" },
                { key: '/payroll', label: "វាយតម្លៃការងារប្រចាំឆ្នាំ" },
            ]
        },
        {
            key: '/awarding',
            icon: <LuGift />,
            label: content['awarding'],
            children: [
                { key: '/employee', label: "ការលើកទឹកចិត្ដ" },
                { key: '/payroll', label: "ប្រភេទលើកទឹកចិត្ដ" },
            ]
        },
        {
            key: '/reports',
            icon: <LuChartNoAxesCombined />,
            label: content['report'],
            children: [
                { key: '/employee', label: "របាយការណ៍ជ្រើសរើសបុគ្គលិក" },
                { key: '/payroll', label: "របាយការណ៍បុគ្គលិក" },
                { key: '/payroll', label: "របាយការណ៍វាយតម្លៃការងារ" },

            ]
        },
    ]

    const settingsMenuItem = [
        {
            type: 'group',
            label: <span style={{ fontWeight: 'bold', color: '#fff', fontSize: 12, paddingLeft: 10 }}>Settings</span>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: content['settings'], children: [
                {
                    key: '/setting/user', label: `${content['user']} & ${content['role']}`, children: [
                        { key: '/setting/user/index', label: content['users'] },
                        { key: '/setting/user/role', label: content['roles'] },
                    ]
                },
                {
                    key: '/setting/employees', label: content['employees'], children: [
                        { key: '/setting/employee/level', label: content['level'] },
                        { key: '/setting/employee/city', label: content['city'] },
                        { key: '/setting/employee/district', label: content['district'] },
                        { key: '/setting/employee/commune', label: content['commune'] },
                        { key: '/setting/employee/village', label: content['village'] },
                    ]
                },
                { key: '/setting/positions', label: content['positions'] },
                { key: '/setting/categories', label: content['categories'] },
                { key: '/setting/job-types', label: content['jobType'] },
                { key: '/setting/departments', label: content['departments'] },
                { key: '/setting/organization', label: content['organizations'] },


            ],
        },
    ]

    // 🔍 Flatten all route items to search through
    const allRoutes = [
        ...employeeItems.flatMap(item => item.children || [item]),
        // ...recruitmentItems,
        ...settingsMenuItem.flatMap(item => item.children || [item])
    ];

    const handleSearch = (value) => {
        const searchValue = value.toLowerCase().trim();

        if (!searchValue) {
            setOptions([]);
            return;
        }

        const matched = allRoutes
            .filter(route => route.label.toLowerCase().includes(searchValue))
            .map(route => ({
                value: route.key,
                label: route.label,
            }));

        setOptions(matched);
    };

    const handleSelect = (key) => {
        navigate(key);
        setSearchText(''); // ✅ This clears the input
        setOptions([]);
    };

    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                // color: '#1677ff',
            }}
        />
    );

    return (
        <>
            {/* Logo section */}
            <div
                className='contain-bg-sidebar !border-r !border-gray-200'
                style={{ textAlign: 'center', padding: '10px 16px 16px' }}
            >
                <img
                    src={Logo
                    }
                    alt="Logo"
                    className='mx-auto'
                    style={{
                        maxWidth: '100%',
                        height: 90,
                        objectFit: 'contain',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate("/")}
                />
                {/* <img
                    src={
                        collapsed
                            ? Logo
                            : LogoTitle
                    }
                    alt="Logo"
                    style={{
                        maxWidth: '100%',
                        height: collapsed ? 40 : 60,
                        objectFit: 'contain',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate("/")}
                /> */}
                {/* {
                    collapsed ? '' :

                        <AutoComplete
                            options={options}
                            onSearch={(value) => {
                                setSearchText(value);  // keep input value in sync
                                handleSearch(value);
                            }}
                            onSelect={(value) => {
                                handleSelect(value);
                            }}
                            value={searchText}  // control AutoComplete value here
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            <Input.Search
                                placeholder="Search pages..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </AutoComplete>
                } */}

            </div>

            {/* Main menu */}
            <Menu
                theme='dark'
                className='!border-r !border-gray-200'
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                items={employeeItems}
            />


            {/* Settings menu with top border */}
            <Menu
                theme='dark'
                className=' !border-gray-200 !border-r !border-l-0 !border-b-0'
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                items={settingsMenuItem}
            />
        </>
    )
}

export default AppSider
