import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCityApi, updateCityApi } from '../../../../services/cityApi';
import { Styles } from '../../../../utils/CsStyle';

const CityUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;

    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await getCityApi(dataId);
            form.setFieldsValue({
                name: response.name,
                isActive: response.isActive
            });
        }
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                name: values.name,
                isActive: values.isActive
            };

            const response = await updateCityApi(dataId, formData);
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

export default CityUpdatePage;
