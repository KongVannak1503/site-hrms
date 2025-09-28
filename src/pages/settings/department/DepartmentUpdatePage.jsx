import React, { useEffect } from 'react';
import { Form, Input, Switch, message } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { getDepartmentApi, updateDepartmentApi } from '../../../services/departmentApi';

const DepartmentUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getDepartmentApi(dataId);
                form.setFieldsValue({
                    title_kh: response.title_kh,
                    title_en: response.title_en,
                    description: response.description,
                    isActive: response.isActive
                });
            } catch (error) {
                console.error("Error fetching department:", error);
                message.error(content['failedToUpdate']);
            }
        };
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                title_kh: values.title_kh,
                title_en: values.title_en,
                description: values.description,
                isActive: values.isActive
            };

            const response = await updateDepartmentApi(dataId, formData);
            message.success(content['updateSuccessFully']);
            onUserUpdated(response.data);
        } catch (error) {
            console.error('Error updating Department:', error);
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
                    {content['cancel']}
                </button>
                <button type="submit" className={Styles.btnUpdate}>
                    {content['update']}
                </button>
            </div>
        </Form>
    );
};

export default DepartmentUpdatePage;
