import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { Typography } from 'antd';
import { getJobTypeApi, updateJobTypeApi } from '../../../services/jobType';

const UpdateJobTypePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;

    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await getJobTypeApi(dataId);
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

            const response = await updateJobTypeApi(dataId, formData);
            message.success(content['updateSuccessFully']);
            onUserUpdated(response.data);
        } catch (error) {
            console.error('Error creating:', error);
            message.error(content['failedToUpdate']);
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
                    {content['cancel']}
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    {content['update']}
                </button>
            </div>
        </Form>
    );
};

export default UpdateJobTypePage;
