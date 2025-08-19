import React, { useEffect } from 'react';
import { Form, Input, Switch, message } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { createDepartmentApi } from '../../../services/departmentApi';

const DepartmentCreatePage = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();

    useEffect(() => {
        form.resetFields();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { title_en, title_kh, description, isActive } = values;
            const formData = { title_en, title_kh, description, isActive };

            const response = await createDepartmentApi(formData);
            message.success(content['createSuccessFully']);
            onUserCreated(response.data);
            form.resetFields();
        } catch (error) {
            console.error('Error creating Department:', error);
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
                name="title_kh"
                label={content['titleKh']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['titleKh']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="title_en"
                label={content['titleEn']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['titleEn']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label={content['description']}
            >
                <Input.TextArea rows={4} placeholder={content['enter'] + content['description']} />
            </Form.Item>

            <Form.Item label={content['status']} name="isActive" valuePropName="checked">
                <Switch />
            </Form.Item>

            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate}>
                    Submit
                </button>
            </div>
        </Form>
    );
};

export default DepartmentCreatePage;
