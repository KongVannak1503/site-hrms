import React, { useEffect } from 'react';
import { Form, Input, Switch, message } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { Typography } from 'antd';
import { createSkillApi } from '../../../services/skillApi';

const SkillCreatePage = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();

    const { Text } = Typography;
    useEffect(() => {
        form.resetFields();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { title, description, isActive } = values;
            const formData = {
                title,
                description,
                isActive,
            };

            console.log(values);

            const response = await createSkillApi(formData);
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

export default SkillCreatePage;
