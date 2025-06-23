import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../components/utils/CsStyle';
import { useAuth } from '../../../components/contexts/AuthContext';
import { Typography } from 'antd';
import { getCategoryApi, updateCategoryApi } from '../../../apis/categoryApi';

const CategoryUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;

    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await getCategoryApi(dataId);
            form.setFieldsValue({
                title: response.title,
                description: response.description,
                isActive: response.isActive
            });
        }
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                title: values.title,
                description: values.description,
                isActive: values.isActive
            };

            const response = await updateCategoryApi(dataId, formData);
            message.success('Updated successfully!');
            onUserUpdated(response.data);
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
            <Form.Item
                name="title"
                label={content['title']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['title']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input size="large" />
            </Form.Item>
            <Form.Item
                name="description"
                label={content['description']}
            >
                <Input.TextArea rows={4} />
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

export default CategoryUpdatePage;
