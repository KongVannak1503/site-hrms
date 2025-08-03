import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserApi, updateUserApi } from '../../../services/userApi';
import { getRolesApi } from '../../../services/roleApi';
import { getEmployeesApi } from '../../../services/employeeApi';

const UserUpdatePage = ({ onUserUpdated, onCancel, userId }) => {
    const { content } = useAuth();
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form] = Form.useForm();
    useEffect(() => {

        const fetchData = async () => {
            try {
                const user = await getUserApi(userId);

                const resRoles = await getRolesApi();
                setRoles(resRoles);

                const resEmployees = await getEmployeesApi();
                setEmployees(resEmployees);

                form.setFieldsValue({
                    username: user.username,
                    email: user.email,
                    role: user.role ? user.role._id : undefined,
                    employeeId: user.employeeId ? user.employeeId._id : undefined,
                    isActive: user.isActive,
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId, content]);


    const handleFinish = async (values) => {
        try {
            const formData = {
                username: values.username,
                employeeId: values.employeeId,
                role: values.role,
                password: values.password
            };

            const response = await updateUserApi(userId, formData);
            message.success('User updated successfully!');
            onUserUpdated(response.data);
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
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="username"
                    label={content['username']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['username']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={content['email']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['email']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input size="large" />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="employeeId"
                    label={content['employee']}
                >
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {employees.map((employee) => (
                            <Select.Option key={employee._id || employee.id} value={employee._id}>
                                {`${employee.last_name_kh} ${employee.first_name_kh} `}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="password"
                    label={content['password']}
                >
                    <Input size="large" type="password" />
                </Form.Item>
                <Form.Item name="confirm" label={`${`${content['confirm']}${content['password']}`}`} dependencies={['password']} rules={[{
                    required: true,
                    message: 'Confirm Password is required',
                    validator: (_, value) => {
                        const passwordValue = form.getFieldValue('password');
                        if (passwordValue && !value) return Promise.reject(new Error('Confirm Password is required'));
                        if (passwordValue && passwordValue !== value) return Promise.reject(new Error('Passwords do not match!'));
                        return Promise.resolve();
                    }
                }]}>
                    <Input.Password size='large' />
                </Form.Item>
                {/* <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: `${content['confirm']}${content['password']}`.toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                    label={content['confirm']}
                >
                    <Input size="large" type="password" />
                </Form.Item> */}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className='!border-yellow-500'>
                    <Form.Item
                        name="role"
                        label={content['role']}
                        rules={[{
                            required: true,
                            message: `${content['selectA']}${content['role']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Select size='large'>
                            {roles.map((role) => (
                                <Select.Option key={role._id} value={role._id}>
                                    {role.role}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={content['status']} name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Card>
            </div>

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

export default UserUpdatePage;
