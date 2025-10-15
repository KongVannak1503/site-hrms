import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload, DatePicker, Tabs, Button, Divider, Avatar, Tooltip } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import { FaRegImages } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';
import { getDepartmentsApi } from '../../services/departmentApi';
import { FileTextOutlined, FormOutlined, IdcardOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { getEmployeeApi, updateEmployeeApi } from '../../services/employeeApi';
import { MdKeyboardArrowRight } from "react-icons/md";
import moment from 'moment';
import uploadUrl from '../../services/uploadApi';
import { useNavigate, useParams } from 'react-router-dom';
import { genderOptions } from '../../data/Gender';
import EmployeePersonalTab from './EmployeePersonalTab ';
import EmployeeEducationTab from './EmployeeEducationTab';
import { getCitiesViewApi } from '../../services/cityApi';
import EmployeeHistoryPage from './EmployeeHistoryPage';
import { getEducationLevelViewApi } from '../../services/educationLevelApi';
import EmployeeDocumentTab from './EmployeeDocumentTab';
import EmployeeNav from './EmployeeNav';
import CustomBreadcrumb from '../../components/breadcrumb/CustomBreadcrumb';
import CityCreatePage from '../settings/employee/city/CityCreatePage';
import ModalMdCenter from '../../components/modals/ModalMdCenter';
import { getPositionsApi, getPositionsViewApi } from '../../services/positionApi';
import { typeEmpStatusOptions } from '../../data/Type';
import '../../components/style/Tap.css';
import TabProfile from './tab/TabProfile';
import TabPosition from './tab/TabPosition';
import { Content } from 'antd/es/layout/layout';
import TabEducation from './tab/TabEducation';
import TabHistory from './tab/TabHistory';
import TabDocument from './tab/TabDocument';
import TabTimeLine from './tab/TabTimeLine';
import TabBook from './tab/TabBook';
import TabLaborLaw from './tab/TabLaborLaw';
import TabNssf from './tab/TabNssf';

const EmployeeViewPage = () => {
    const { id } = useParams();
    const { content, language, identity, isEmployee } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;
    const [fileList, setFileList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewMangerUrl, setPreviewMangerUrl] = useState(null);
    const { TabPane } = Tabs;
    const [file, setFile] = useState(null);
    const [cities, setCities] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [villages, setVillages] = useState([]);
    const [levels, setLevels] = useState([]);
    const [position, setPosition] = useState([]);
    const [positions, setPositions] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('create');
    const [selectId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `${content['employeeInfo']} | USEA`;
        const fetchInitialData = async () => {
            try {
                const response = await getEmployeeApi(id);
                setPosition(response);
                setEmployee(response);
                if (response?.image_url?.path) {
                    setPreviewUrl(uploadUrl + "/" + response.image_url.path);
                }
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        };

        if (id) {
            fetchInitialData();
        }
    }, [id, content]);


    const managers = employee?.positionId?.department?.manager || [];
    useEffect(() => {
        // Clean up preview URL to avoid memory leaks

        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resDepartments = await getDepartmentsApi();
                setDepartments(resDepartments);
                const resPositions = await getPositionsViewApi();
                setPositions(resPositions);

                const resCities = await getCitiesViewApi();
                setCities(resCities);

                const resLevel = await getEducationLevelViewApi();
                setLevels(resLevel);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);


    const adminemployeePermission = identity?.role?.permissions?.find(
        p => p.permissionId?.name === "admin"
    );
    const adminAllowedActions = adminemployeePermission?.actions || [];

    const employeePermission = identity?.role?.permissions?.find(
        p => p.permissionId?.name === "employees"
    );

    const allowedActions = employeePermission?.actions || [];
    const permissionMap = allowedActions.reduce((acc, action) => {
        acc[action] = true;
        return acc;
    }, {});

    const employeeAllowedActions = employeePermission?.actions || [];
    // Determine if the user can edit
    const canEdit = (!isEmployee && employeeAllowedActions.includes('update')) ||
        (isEmployee && adminAllowedActions.includes('view')) ||
        (identity?.employeeId._id == id && employeeAllowedActions.includes('update'));

    const tabList = [
        { key: 'profile', tab: content['profile'] || 'Profile', permissionKey: 'view' },
        { key: 'position', tab: content['additionalPositions'] || 'Position', permissionKey: 'additional-position' },
        { key: 'education', tab: content['education'] || 'Education', permissionKey: 'education' },
        { key: 'history', tab: content['employmentHistory'] || 'History', permissionKey: 'employee-history' },
        { key: 'documents', tab: content['document'] || 'Documents', permissionKey: 'document' },
        { key: 'books', tab: content['employeeBook'] || 'Book', permissionKey: 'employee-book' },
        { key: 'contract', tab: content['contract'] || 'Contract', permissionKey: 'contract' },
        { key: 'nssf', tab: content['nssf'] || 'NSSF', permissionKey: 'nssf' },
        { key: 'activity', tab: content['seniorityPayment'] || 'Seniority Payment', permissionKey: 'seniority-payment' },
    ];

    const contentList = {
        profile: <TabProfile employee={employee} />,
        position: <TabPosition id={id} />,
        education: <TabEducation id={id} />,
        history: <TabHistory id={id} />,
        documents: <TabDocument id={id} />,
        activity: <TabTimeLine id={id} />,
        books: <TabBook id={id} />,
        contract: <TabLaborLaw id={id} />,
        nssf: <TabNssf id={id} />,
    };

    const visibleTabs = tabList.filter(tab => permissionMap[tab.permissionKey]);
    const visibleContentList = {};
    visibleTabs.forEach(tab => {
        visibleContentList[tab.key] = contentList[tab.key];
    });


    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['view'], },
    ];

    const handleUpdateNav = (id) => {
        navigate(`/employee/update/${id}`);
    };

    // const canEdit = (isEmployee && employeeAllowedActions.includes('update')) || isAdmin;
    return (
        <div style={{ margin: 24, }}>
            <div className="flex justify-between mb-3">
                <h1 className='text-xl font-extrabold text-[#002060]'><FileTextOutlined className='mr-2' />ព័ត៌មានបុគ្គលិក</h1>
                <CustomBreadcrumb items={breadcrumbItems} />

            </div>
            <Content
                className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >
                <div className="flex justify-between">
                    <p className='text-default text-sm font-bold'>{content['detailInfo'] || 'ព័ត៌មានលម្អិត'}</p>
                    {canEdit && (
                        <Tooltip title={content['edit']}>
                            <button
                                className={Styles.btnEdit}
                                onClick={() => handleUpdateNav(id)}
                            >
                                <FormOutlined />
                            </button>
                        </Tooltip>
                    )}


                </div>
                <Divider className='!mt-4 !mb-7' />
                <div className="flex flex-col">

                    <div className="flex gap-6">
                        <div className="w-[300px]">
                            <Card className='shadow'>
                                <div className="flex justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="photo"
                                        className="w-[100px] h-[110px] rounded object-cover"
                                    />
                                </div>
                                <div className="text-center">
                                    <div className="text-base font-semibold mt-5">
                                        {language == 'khmer' ? employee?.name_kh : employee?.name_en}
                                    </div>
                                    <p className='py-3'>
                                        {language == 'khmer' ? employee?.positionId?.title_kh : employee?.positionId?.title_en}
                                    </p>
                                    <p>
                                        <span className='px-5 font-semibold text-white rounded text-default bg-default-light'> {language === 'khmer'
                                            ? typeEmpStatusOptions.find(opt => opt.id == employee?.status)?.name_kh
                                            : typeEmpStatusOptions.find(opt => opt.id == employee?.status)?.name_en}
                                        </span>
                                    </p>
                                </div>
                                <Divider />
                                <div className='flex flex-col gap-1'>
                                    <p><IdcardOutlined className='mr-2' /> {employee?.employee_id}</p>
                                    <p><MailOutlined className='mr-2' /> {employee?.email}</p>
                                    <p><PhoneOutlined className='mr-2' /> {employee?.phone}</p>
                                </div>
                                <Divider />
                                <div className='flex flex-col gap-1'>
                                    <p className='text-gray-500 text-xs flex justify-between items-center'><span>{content['department']}</span><MdKeyboardArrowRight /> </p>
                                    <p> {language == 'khmer' ? employee?.positionId?.department?.title_kh : employee?.positionId?.department?.title_en}</p>
                                    <p className='text-gray-500 text-xs pt-2 flex justify-between items-center mb-1'>{content['manager']} <MdKeyboardArrowRight /></p>
                                    {managers.map((manager, index) => {
                                        const imagePath = manager?.image_url?.path;
                                        const fullImageUrl = imagePath ? `${uploadUrl}/${imagePath}` : null;

                                        return (
                                            <div key={manager._id || index} className='flex items-center gap-2'>
                                                <Avatar
                                                    src={fullImageUrl}
                                                    alt={manager?.name_en}
                                                >
                                                    {manager?.name_en?.charAt(0)}
                                                </Avatar>
                                                <p>{language == 'khmer' ? manager?.name_kh : manager?.name_en}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>

                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <Card
                                className="shadow custom-tabs"
                                tabList={visibleTabs}
                                activeTabKey={activeTab}
                                onTabChange={(key) => setActiveTab(key)}
                            >
                                <div style={{ fontSize: 5 }}>
                                    {contentList[activeTab]}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </Content>
        </div >
    );
};

export default EmployeeViewPage;
