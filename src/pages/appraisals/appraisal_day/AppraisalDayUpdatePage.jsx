import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, DatePicker } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { createAppraisalApi, getAppraisalApi, updateAppraisalApi } from '../../../services/AppraisalApi';
import { Styles } from '../../../utils/CsStyle';
import dayjs from 'dayjs';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getAllKpiApi } from '../../../services/KpiApi';
import AppraisalDayForm from './AppraisalDayForm';

const AppraisalDayUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
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
                const response = await getAppraisalApi(dataId);
                form.setFieldsValue({
                    ...response,
                    startDate: response.startDate ? dayjs(response.startDate) : null,
                    department: response.department || 'all', // optional fallback
                    kpiTemplate: response.kpiTemplate,
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
            const { startDate, kpiTemplate, department } = values;

            const formData = {
                kpiTemplate,
                department,
                startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            };

            const response = await updateAppraisalApi(dataId, formData);
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

export default AppraisalDayUpdatePage;
