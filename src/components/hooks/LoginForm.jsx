import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { loginUser } from '../../apis/authApi';

const LoginForm = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);

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
            <div className='border border-gray-300 rounded shadow-lg p-7'>
                <div className="flex justify-center">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrmJyV86m97sc2Pahu8bd8Kbw9-hRQoFSpQ&s" width={180} alt="" />
                </div>
                <Form.Item
                    label="Username"
                    name="username"
                    className='!mb-2'
                    rules={[
                        { required: true, message: 'Please enter your username' },
                        { type: 'username', message: 'Please enter a valid username' },
                    ]}
                >
                    <Input size='large' />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password size='large' />
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
