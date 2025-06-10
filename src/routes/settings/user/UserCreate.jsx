import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card } from 'antd';
import { Styles } from '../../../components/utils/CsStyle';
import { useAuth } from '../../../components/contexts/AuthContext';
import { getRoleApi } from '../../../apis/roleApi';

const UserCreate = ({ form, onCancel }) => {
    const { content } = useAuth();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoleApi();
                setRoles(response.data);
            } catch (error) {
                message.error('Failed to fetch roles');
            }
        };
        fetchRoles();
    }, []);

    return (
        <Form
            form={form}
            layout="vertical"
            name="userForm"
            autoComplete="off"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    label={content['confirm']}
                    rules={[{
                        required: true,
                        message: `${content['confirm']}${content['password']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
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
                    <Form.Item label={content['status']} name="isActive" valuePropName="checked" initialValue={true}>
                        <Switch />
                    </Form.Item>
                </Card>
            </div>

            <div className="text-end">
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
