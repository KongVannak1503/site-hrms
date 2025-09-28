import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../../contexts/AuthContext';
import { Styles } from '../../../../utils/CsStyle';
import { createEducationLevelApi } from '../../../../services/educationLevelApi';

const EducationLevelCreatePage = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();

    const { Text } = Typography;
    useEffect(() => {
        form.resetFields();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { name, isActive } = values;
            const formData = {
                name,
                isActive,
            };

            const response = await createEducationLevelApi(formData);
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
                isActive: true
            }}
        >
            <Form.Item
                name="name"
                label={content['name']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['name']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input size="large" />
            </Form.Item>
            <Form.Item label={content['status']} name="isActive" valuePropName="checked">
                <Switch />
            </Form.Item>
            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    {content['cancel']}
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    {content['save']}
                </button>
            </div>
        </Form>
    );
};

export default EducationLevelCreatePage;
