import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, DatePicker } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { createAppraisalApi } from '../../../services/AppraisalApi';
import { Styles } from '../../../utils/CsStyle';
import dayjs from 'dayjs';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getAllKpiApi } from '../../../services/KpiApi';
import AppraisalDayForm from './AppraisalDayForm';

const AppraisalDayCreatePage = ({ onCancel, onUserCreated }) => {
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
            const { startDate, kpiTemplate, department } = values;
            const formData = {

                kpiTemplate,
                department,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            };
            console.log(values);

            const response = await createAppraisalApi(formData);
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
            <AppraisalDayForm
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

export default AppraisalDayCreatePage;
