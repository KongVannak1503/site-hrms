import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { Typography } from 'antd';
import PayrollFormPage from './PayrollFormPage';
import { createBonusApi } from '../../../services/payrollApi';

const PayrollCreatePage = ({ onCancel, onUserCreated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { Text } = Typography;
    useEffect(() => {
        // form.resetFields();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { payDate } = values;

            const formData = {
                payDate: payDate.format('YYYY-MM-DD'),
            };
            console.log('🟡 Payload sent to backend:', formData); // 👈 log this

            const response = await createBonusApi(formData);
            message.success('Created successfully!');
            onUserCreated(response.data);
        } catch (error) {
            console.error('❌ Error creating User:', error);
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
            <PayrollFormPage Form={Form} form={form} />
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

export default PayrollCreatePage;
