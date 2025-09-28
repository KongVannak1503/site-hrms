import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { Typography } from 'antd';
import PayrollFormPage from './PayrollFormPage';
import { getBonusApi, updateBonusApi } from '../../../services/payrollApi';
import dayjs from 'dayjs';


const PayrollUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;

    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await getBonusApi(dataId);
            form.setFieldsValue({
                payDate: response.payDate ? dayjs(response.payDate) : null,
            });
        }
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                payDate: values.payDate
            };

            const response = await updateBonusApi(dataId, formData);
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
            <PayrollFormPage Form={Form} form={form} />
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

export default PayrollUpdatePage;
