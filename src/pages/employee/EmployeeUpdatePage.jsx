import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload, DatePicker, Tabs, Button } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import { FaRegImages } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';
import { getDepartmentsApi } from '../../services/departmentApi';
import { FileTextOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getEmployeeApi, updateEmployeeApi } from '../../services/employeeApi';
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

const EmployeeUpdatePage = () => {
    const { id } = useParams();
    const { content, language } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;
    const [fileList, setFileList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { TabPane } = Tabs;
    const [file, setFile] = useState(null);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [villages, setVillages] = useState([]);
    const [levels, setLevels] = useState([]);
    const [position, setPosition] = useState([]);
    const [positions, setPositions] = useState([]);
    const [activeTab, setActiveTab] = useState('personal');
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('create');
    const [selectId, setSelectedId] = useState(null);

    const closeDrawer = async () => {
        setOpen(false);
        // refreshLanguages();
    };

    // const refreshLanguages = async () => {
    //     try {
    //         const resLanguages = await getLanguagesApi();
    //         setLanguages(resLanguages);
    //         console.log(resLanguages);
    //     } catch (error) {
    //         console.error("Failed to fetch languages:", error);
    //     }
    // };

    const showCreateDrawer = (create = '', id = '') => {
        if (create == 'create') {
            setOpen(true);
            setActionForm('create');
        } if (create == 'update') {
            setOpen(true);
            setSelectedId(id);
            setActionForm('update');
        }

    };

    useEffect(() => {
        document.title = `${content['employeeInfo']} | USEA`;
        const fetchInitialData = async () => {
            try {
                const response = await getEmployeeApi(id);
                setPosition(response);
                if (response?.image_url?.path) {
                    setPreviewUrl(uploadUrl + "/" + response.image_url.path);
                }
                form.setFieldsValue({
                    employee_id: response.employee_id,
                    last_name_kh: response.last_name_kh,
                    first_name_kh: response.first_name_kh,
                    last_name_en: response.last_name_en,
                    first_name_en: response.first_name_en,
                    gender: response.gender,
                    email: response.email,
                    phone: response.phone,
                    status: response.status,
                    bloodType: response.bloodType,
                    joinDate: response.joinDate ? moment(response.joinDate) : null,
                    date_of_birth: response.date_of_birth ? moment(response.date_of_birth) : null,
                    place_of_birth: response.place_of_birth,
                    nationality: response.nationality,
                    id_card_no: response.id_card_no,
                    passport_no: response.passport_no,
                    present_address: response.present_address,
                    permanent_address: response.permanent_address,
                    emergency_contact: response.emergency_contact,
                    family_members: response.family_member,
                    city: response.city?._id || response.city,
                    positionId: response.positionId?._id || response.positionId,
                    district: response.district,
                    commune: response.commune,
                    village: response.village,

                    // present
                    present_city: response.present_city?._id || response.present_city,
                    present_district: response.present_district,
                    present_commune: response.present_commune,
                    present_village: response.present_village,

                    staff_relationships: response.staff_relationships?.map(item => ({
                        ...item,
                        date_of_birth: item.date_of_birth ? moment(item.date_of_birth) : null,
                    })),
                });
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        };

        if (id) {
            fetchInitialData();
        }
    }, [id, content]);



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
    const handleChange = ({ fileList: newFileList }) => {
        const latestFileList = newFileList.slice(-1);
        setFileList(latestFileList);
        const selectedFile = latestFileList[0]?.originFileObj;

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl(null);
        }
    };



    const handleFinish = async (values) => {
        try {

            const formData = new FormData();
            const safeAppend = (key, value) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value);
                }
            };
            // Flat fields
            formData.append('employee_id', values.employee_id);
            formData.append('first_name_en', values.first_name_en); // Assuming you use first_name_en for backend
            formData.append('last_name_en', values.last_name_en);   // Same here
            formData.append('first_name_kh', values.first_name_kh); // Assuming you use first_name_en for backend
            formData.append('last_name_kh', values.last_name_kh);
            formData.append('gender', values.gender || '');
            formData.append('email', values.email || '');
            formData.append('phone', values.phone || '');
            formData.append('bloodType', values.bloodType || '');
            formData.append('id_card_no', values.id_card_no || '');
            formData.append('passport_no', values.passport_no || '');
            formData.append('joinDate', values.joinDate);
            formData.append('date_of_birth', values.date_of_birth);
            formData.append('place_of_birth', values.place_of_birth || '');
            formData.append('nationality', values.nationality || '');
            formData.append('maritalStatus', values.maritalStatus || '');
            safeAppend('city', values.city);
            formData.append('district', values.district);
            formData.append('commune', values.commune);
            formData.append('village', values.village);
            formData.append('positionId', values.positionId);
            // present
            safeAppend('present_city', values.present_city);
            formData.append('present_district', values.present_district);
            formData.append('present_commune', values.present_commune);
            formData.append('present_village', values.present_village);
            formData.append('isActive', values.isActive ?? true);

            // Nested objects (stringify before sending)
            formData.append('family_members', JSON.stringify(values.family_members || []));
            formData.append('emergency_contact', JSON.stringify(values.emergency_contact || []));
            safeAppend('status', values.status);

            formData.append('file', file);
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('file', fileList[0].originFileObj);
            }

            // Call your update API with  and formData
            const response = await updateEmployeeApi(id, formData);

            message.success('User updated successfully!');
            // onUserUpdated(response.data);

        } catch (error) {
            console.error('Error updating User:', error);
            message.error('Failed to update User');
        }
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['update'] }
    ];

    return (
        <div className="flex flex-col">
            {/* Fixed Tabs */}
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <EmployeeNav />
            </div>
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                autoComplete="off"
                style={{
                    paddingTop: 70,
                    paddingBottom: 100,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeInfo']}</p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>
                {/* Always render all tab contents, but control visibility via style only */}
                <div style={{ display: activeTab === 'personal' ? 'block' : 'none' }}>
                    <EmployeePersonalTab
                        fileList={fileList}
                        content={content}
                        handleChange={handleChange}
                        previewUrl={previewUrl}
                        genderOptions={genderOptions}
                        departments={departments}
                        cities={cities}
                        districts={districts}
                        communes={communes}
                        villages={villages}
                        showCreateDrawer={showCreateDrawer}
                        position={position}
                        positions={positions}
                        language={language}
                    />
                </div>

                {/* <div style={{ display: activeTab === 'education' ? 'block' : 'none' }}>
                    <EmployeeEducationTab
                        levels={levels}
                        content={content} />
                </div>

                <div style={{ display: activeTab === 'history' ? 'block' : 'none' }}>
                    <EmployeeHistoryPage content={content} />
                </div>

                <div style={{ display: activeTab === 'document' ? 'block' : 'none' }}>
                    <EmployeeDocumentTab content={content} />
                </div> */}

                {/* Submit Button */}
                <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                    style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                    {/* <button type="button" className={Styles.btnCancel}>Cancel</button> */}
                    <button type="submit" className={Styles.btnCreate}>{content["submit"]}</button>
                </div>
            </Form>
            <ModalMdCenter
                open={open}
                onOk={() => setOpen(false)}
                onCancel={closeDrawer}
                title={
                    actionForm === 'create'
                        ? `${content['create']} ${content['newStart']} ${content['city']}${content['newEnd']}`
                        : `${content['update']} ${content['city']}`
                }
            >
                {actionForm === 'create' ? (
                    <CityCreatePage mess={"mess"} onUserCreated={''} onCancel={closeDrawer} />
                ) : (
                    ''
                    // <CityUpdatePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                )}
            </ModalMdCenter>
        </div >
    );
};

export default EmployeeUpdatePage;
