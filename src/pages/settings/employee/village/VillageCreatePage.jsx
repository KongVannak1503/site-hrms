import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../../contexts/AuthContext';
import { Styles } from '../../../../utils/CsStyle';
import { createVillageApi } from '../../../../services/villageApi';

const VillageCreatePage = ({ form, onCancel, onUserCreated }) => {
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

            const response = await createVillageApi(formData);
            message.success('Created successfully!');

            onUserCreated(response.data);
            form.resetFields();
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
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </Form>
    );
};

export default VillageCreatePage;
