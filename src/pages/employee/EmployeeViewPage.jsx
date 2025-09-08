import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload, DatePicker, Tabs, Button, Divider, Avatar } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import { FaRegImages } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';
import { getDepartmentsApi } from '../../services/departmentApi';
import { FileTextOutlined, IdcardOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { getEmployeeApi, updateEmployeeApi } from '../../services/employeeApi';
import { MdKeyboardArrowRight } from "react-icons/md";
import moment from 'moment';
import uploadUrl from '../../services/uploadApi';
import { useParams } from 'react-router-dom';
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
import { getPositionsApi } from '../../services/positionApi';
import { typeEmpStatusOptions } from '../../data/Type';
import '../../components/style/Tap.css';
import TabProfile from './tab/TabProfile';
import TabPosition from './tab/TabPosition';
import { Content } from 'antd/es/layout/layout';
import TabEducation from './tab/TabEducation';
import TabHistory from './tab/TabHistory';
import TabDocument from './tab/TabDocument';
import TabTimeLine from './tab/TabTimeLine';

const EmployeeViewPage = () => {
    const { id } = useParams();
    const { content, language } = useAuth();
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
                const resPositions = await getPositionsApi();
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
    }, [content])

    const tabList = [
        {
            key: 'profile',
            tab: content['profile'] || 'Profile',
        },
        {
            key: 'position',
            tab: content['position'] || 'Position',
        },
        {
            key: 'education',
            tab: content['education'] || 'Education',
        },
        {
            key: 'history',
            tab: content['employmentHistory'] || 'History',
        },
        {
            key: 'documents',
            tab: content['document'] || 'Documents',
        },
        {
            key: 'activity',
            tab: content['seniorityPayment'] || 'Seniority Payment',
        },
    ];

    const contentList = {
        profile: <TabProfile employee={employee} />,
        position: <TabPosition id={id} />,
        education: <TabEducation id={id} />,
        history: <TabHistory id={id} />,
        documents: <TabDocument id={id} />,
        activity: <TabTimeLine id={id} />,
    };


    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['view'], },
    ];
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
                <p className='text-default text-sm font-bold'>{content['detailInfo'] || 'ព័ត៌មានលម្អិត'}</p>
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
                                        <span className='px-5 font-semibold text-white rounded text-default bg-default-light'> {language === 'kh'
                                            ? typeEmpStatusOptions.find(opt => opt.id === employee?.status)?.name_kh
                                            : typeEmpStatusOptions.find(opt => opt.id === employee?.status)?.name_en}
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
                                    <p className='text-gray-400 text-xs flex justify-between items-center'><span>{content['department']}</span><MdKeyboardArrowRight /> </p>
                                    <p> {language == 'khmer' ? employee?.positionId?.department?.title_kh : employee?.positionId?.department?.title_en}</p>
                                    <p className='text-gray-400 text-xs pt-2 flex justify-between items-center mb-1'>{content['manager']} <MdKeyboardArrowRight /></p>
                                    {managers.map((manager) => {
                                        const imagePath = manager?.image_url?.path;
                                        const fullImageUrl = imagePath ? `${uploadUrl}/${imagePath}` : null;

                                        return (
                                            <div className='flex items-center gap-2'>
                                                <Avatar
                                                    key={manager._id}
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
                                tabList={tabList}
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
