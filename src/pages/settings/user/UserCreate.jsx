import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../components/utils/CsStyle';
import { useAuth } from '../../../components/contexts/AuthContext';
import { createUserApi } from '../../../apis/userApi';
import { getRolesApi } from '../../../apis/roleApi';

const UserCreate = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        form.resetFields();

        const fetchData = async () => {
            try {
                const resRoles = await getRolesApi();
                setRoles(resRoles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);

    const handleFinish = async (values) => {
        try {
            const { username, password, email, role, isActive } = values;
            const formData = {
                username,
                password,
                email,
                role,
                isActive,
            };

            const response = await createUserApi(formData);
            message.success('User created successfully!');

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
            name="userForm"
            autoComplete="off"
            initialValues={{
                isActive: true
            }}
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
                    rules={[{
                        required: true,
                        message: `${content['selectA']}${content['employee']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Select
                        defaultValue="lucy"
                        size="large"
                        options={[
                            {
                                label: <span>manager</span>,
                                title: 'manager',
                                options: [
                                    { label: <span>Jack</span>, value: 'Jack' },
                                    { label: <span>Lucy</span>, value: 'Lucy' },
                                ],
                            },

                        ]}
                    />
                </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="password"
                    label={content['password']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['password']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input size="large" type="password" />
                </Form.Item>
                <Form.Item
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
                </Form.Item>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className='border-yellow-500'>
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
                                    {role.name}
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

export default UserCreate;
