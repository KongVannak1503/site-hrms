import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, DatePicker, Checkbox } from 'antd';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../../../../contexts/AuthContext';
import { createSubBonusApi } from '../../../../services/payrollApi';
import { Styles } from '../../../../utils/CsStyle';
import { useParams } from 'react-router-dom';
import { getEmployeeApi } from '../../../../services/employeeApi';


const SubPayrollFormPage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const { id } = useParams();
    const [form] = Form.useForm();
    const { Text } = Typography;

    useEffect(() => {
        const fetchInitialData = async () => {
            form.resetFields();
            const response = await getEmployeeApi(dataId);
            const { subBonus = [] } = response;

            // Find the subBonus with matching bonusId
            const matchingSubBonus = subBonus.find(sb => sb.bonusId?._id === id);

            if (matchingSubBonus) {
                form.setFieldsValue({
                    isSix: matchingSubBonus.isSix,
                    isTwelve: matchingSubBonus.isTwelve,
                    isSixTotal: matchingSubBonus.isSixTotal,
                    isTwelveTotal: matchingSubBonus.isTwelveTotal,
                });
            }
        }
        fetchInitialData();
    }, [dataId, content, id]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                bonusId: id,
                isSix: values.isSix || false,
                isTwelve: values.isTwelve || false,
                isSixTotal: values.isSixTotal,
                isTwelveTotal: values.isTwelveTotal,
                payDate: values.payDate,
            };

            const response = await createSubBonusApi(dataId, formData);

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
            {/* isSix total input */}
            <Form.Item
                name="isSixTotal"
                label={content['total'] + `(6 ${content['months']})`}
                rules={[{
                    required: true,
                    message: `${content['selectA']}${content['total']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input type='number' />
            </Form.Item>
            <Form.Item name="isSix" valuePropName="checked">
                <Checkbox>{`6 ${content['months']}`}</Checkbox>
            </Form.Item>

            {/* isTwelve total input */}
            <Form.Item
                name="isTwelveTotal"
                label={content['total'] + `(12 ${content['months']})`}
            >
                <Input type='number' />
            </Form.Item>
            <Form.Item name="isTwelve" valuePropName="checked">
                <Checkbox>{`12 ${content['months']}`}</Checkbox>
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

export default SubPayrollFormPage;
