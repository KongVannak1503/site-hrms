import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload, DatePicker, Tabs, Button } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import { FaRegImages } from "react-icons/fa";
import { createEmployeeApi } from '../../services/employeeApi';
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';
import { getDepartmentsApi } from '../../services/departmentApi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { genderOptions } from '../../data/Gender';
import EmployeePersonalTab from './EmployeePersonalTab ';
import { getCitiesViewApi } from '../../services/cityApi';
import { getDistrictsViewApi } from '../../services/DistrictApi';
import { getCommunesViewApi } from '../../services/communeApi';
import { getVillagesViewApi } from '../../services/villageApi';
import { useNavigate } from 'react-router-dom';

const EmployeeCreatePage = () => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [villages, setVillages] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { TabPane } = Tabs;
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
    }, [content]);

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

                const resCities = await getCitiesViewApi();
                setCities(resCities);

                const resDistrict = await getDistrictsViewApi();
                setDistricts(resDistrict);

                const resCommunes = await getCommunesViewApi();
                setCommunes(resCommunes);

                const resVillages = await getVillagesViewApi();
                setVillages(resVillages);

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
            setFile(selectedFile); // ← make sure this is called
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null); // ← clear file if none
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
            formData.append('gender', values.gender);
            formData.append('height', values.height);
            formData.append('date_of_birth', values.date_of_birth);
            formData.append('place_of_birth', values.place_of_birth);
            formData.append('nationality', values.nationality);
            formData.append('maritalStatus', values.maritalStatus);
            // Optional ObjectId fields (skip if invalid)
            safeAppend('city', values.city);
            safeAppend('district', values.district);
            safeAppend('commune', values.commune);
            safeAppend('village', values.village);
            formData.append('isActive', values.isActive ?? true);

            // Upload file if any
            formData.append('file', file);

            // Nested objects (stringify before sending)
            formData.append('present_address', JSON.stringify(values.present_address || {}));
            formData.append('permanent_address', JSON.stringify(values.permanent_address || {}));
            formData.append('family_members', JSON.stringify(values.family_members || []));
            formData.append('emergency_contact', JSON.stringify(values.emergency_contact || []));
            formData.append('staff_relationships', JSON.stringify(values.staff_relationships || []));

            // Submit to API
            const res = await createEmployeeApi(formData);
            console.log(res);

            message.success('Created successfully');
            // form.resetFields();
            navigate(`/employee/update/${res.data?._id}`);
        } catch (error) {
            console.error('Create error:', error);
            message.error(error.response?.data?.message || 'Failed to create');
        }
    };



    const tabItems = [
        {
            key: 'personal',
            label: 'Personal Data',
        },

    ];
    return (
        <div className="flex flex-col">
            {/* Fixed Tabs */}
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <Tabs
                    className='custom-tabs'
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={tabItems}
                />
            </div>
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                autoComplete="off"
                style={{
                    paddingTop: 85,
                    paddingBottom: 100,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
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
                    />
                </div>

                {/* Submit Button */}
                <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                    style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                    <button type="button" className={Styles.btnCancel}>Cancel</button>
                    <button type="submit" className={Styles.btnCreate}>Submit</button>
                </div>
            </Form>

        </div >
    );
};

export default EmployeeCreatePage;
