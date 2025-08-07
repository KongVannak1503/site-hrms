import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, DatePicker } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import dayjs from 'dayjs';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getAllKpiApi } from '../../../services/KpiApi';
import AppraisalMonthForm from './AppraisalMonthForm';
import { createAppraisalMonthApi } from '../../../services/AppraisalApi';

const AppraisalMonthCreatePage = ({ onCancel, onUserCreated }) => {
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
            } catch (error) {
                console.log("Error", error)
            }
        }
        form.resetFields();
        fetchData();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { startDate, endDate, kpiTemplate, department, announcementDay } = values;
            const formData = {
                kpiTemplate,
                department,
                endDate,
                announcementDay,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            };
            console.log(values);

            const response = await createAppraisalMonthApi(formData);
            message.success(content['createSuccessFully']);

            onUserCreated(response.data);
            form.resetFields();
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
            initialValues={{
                department: 'all',
                startDate: dayjs(),
            }}
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

export default AppraisalMonthCreatePage;
