import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { createLanguageApi } from '../../../services/employeeApi';
import { Styles } from '../../../utils/CsStyle';
import LanguagePage from './LanguagePage';

const LanguageCreatePage = ({ onCancel }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;
    useEffect(() => {
        form.resetFields();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { name_en, name_kh } = values;
            const formData = {
                name_en,
                name_kh
            };

            await createLanguageApi(formData);
            message.success(content['saveSuccessful']);

            form.resetFields();
            onCancel();
        } catch (error) {
            console.error('Error creating User:', error);
            message.error('Failed to create User');
        }
    };


    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            initialValues={{
                isActive: true
            }}
        >
            <LanguagePage
                content={content}
            />

            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </Form>
    );
};

export default LanguageCreatePage;
