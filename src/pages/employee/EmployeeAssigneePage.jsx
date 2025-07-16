import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, message } from 'antd';
import { useState } from 'react';
import { assignEmployeeApi, getEmployeeApi } from '../../services/employeeApi';
import { getPositionsApi } from '../../services/positionApi';
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';

const EmployeeAssigneePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resEmployees = await getPositionsApi();
                setPositions(resEmployees);
                const response = await getEmployeeApi(dataId);
                form.setFieldsValue({
                    positionId: response.positionId
                });
            } catch (error) {
                console.error("Error fetching department:", error);
                message.error("Failed to load department data");
            }
        };
        fetchInitialData();
    }, [dataId, content]);

    const handleFinish = async (values) => {
        try {
            const formData = {
                positionId: values.positionId
            };

            const response = await assignEmployeeApi(dataId, formData);
            message.success('Updated successfully!');
            onUserUpdated(response.data);
        } catch (error) {
            console.error('Error updating Department:', error);
            message.error('Failed to update Department');
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
                name="positionId"
                label={content['employee']}
                rules={[{
                    required: true,
                    message: `${content['selectA']}${content['employee']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {positions.map((position) => (
                        <Select.Option key={position._id || position.id} value={position._id}>
                            {position.title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnUpdate}>
                    Update
                </button>
            </div>
        </Form>
    );
};

export default EmployeeAssigneePage;
