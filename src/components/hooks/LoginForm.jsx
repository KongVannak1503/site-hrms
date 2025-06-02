import React, { useContext, useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { loginUser } from '../../apis/authApi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LanguageContext } from '../Translate/LanguageContext';

const LoginForm = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const { content } = useContext(LanguageContext)

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await loginUser(values.username, values.password);
            message.success('Login successful!');
            localStorage.setItem('token', res.data.token);
            onSuccess(res.data); // call callback to update app state or redirect
        } catch (err) {
            const msg =
                err.response?.data?.message || 'Login failed. Please try again.';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <div className=' border border-gray-100 bg-white rounded-md shadow-md p-7'>
                <Form.Item
                    name="username"
                    className=' '
                    rules={[
                        { required: true, message: 'Please enter your username' },
                        { type: 'username', message: 'Please enter a valid username' },
                    ]}
                >
                    <Input prefix={<UserOutlined />} size='large' placeholder={content['username']} />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password prefix={<LockOutlined />} size='large' placeholder={content['password']} />
                </Form.Item>

                <Form.Item>
                    <Button size='large' type="primary" htmlType="submit" loading={loading}>
                        Login
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default LoginForm;
