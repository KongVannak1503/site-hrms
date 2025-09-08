import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, DatePicker } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { Styles } from '../../../utils/CsStyle';
import dayjs from 'dayjs';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getAllKpiApi } from '../../../services/KpiApi';
import AppraisalMonthForm from './AppraisalMonthForm';
import { getAppraisalMonthApi, updateAppraisalMonthApi } from '../../../services/AppraisalApi';

const AppraisalMonthUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content, language } = useAuth();
    const [form] = Form.useForm();
    const [departments, setDepartments] = useState([]);
    const [templates, setTemplates] = useState([]);
    const { Text } = Typography;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDepartmentsApi();
                setDepartments(res)
                const resTemplate = await getAllKpiApi();
                setTemplates(resTemplate);
                const response = await getAppraisalMonthApi(dataId);
                form.setFieldsValue({
                    ...response,
                    startDate: response.startDate ? dayjs(response.startDate) : null,
                    endDate: response.endDate ? dayjs(response.endDate) : null,
                    // department: response.department || 'all', // optional fallback
                    kpiTemplate: response.kpiTemplate,
                    announcementDay: response.announcementDay,
                });
            } catch (error) {
                console.log("Error", error)
            }
        }
        form.resetFields();
        fetchData();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { name, startDate, kpiTemplate, announcementDay } = values;

            const formData = {
                name,
                kpiTemplate,
                // department,
                announcementDay,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            };

            const response = await updateAppraisalMonthApi(dataId, formData);
            message.success(content['createSuccessFully']);

            onUserUpdated(response.data);
        } catch (error) {
            console.error('Error creating User:', error);
            message.error(content['failedToCreate']);
        }
    };


    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
        >
            <AppraisalMonthForm
                form={form}
                content={content}
                language={language}
                departments={departments}
                templates={templates}
                onFinish={handleFinish}
                onCancel={onCancel}
            />
        </Form>
    );
};

export default AppraisalMonthUpdatePage;
