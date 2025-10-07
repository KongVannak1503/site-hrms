import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import LanguagePage from './LanguagePage';
import { Styles } from '../../../utils/CsStyle';
import { getLanguageApi, updateLanguageApi } from '../../../services/employeeApi';

const LanguageUpdatePage = ({ dataId, content, onCancel }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await getLanguageApi(dataId);
            form.setFieldsValue({
                name_en: response.name_en,
                name_kh: response.name_kh
            });
        }
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                name_en: values.name_en,
                name_kh: values.name_kh
            };

            const response = await updateLanguageApi(dataId, formData);
            message.success(content['saveSuccessful']);
            onCancel();
        } catch (error) {
            console.error('Error creating:', error);
            message.error('Failed to create');
        }
    };


    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
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

export default LanguageUpdatePage;
