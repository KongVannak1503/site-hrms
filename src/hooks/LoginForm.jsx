import React, { useContext, useState } from 'react';
import { Input, Button, Form, message, Checkbox } from 'antd';
import { loginUser } from '../../apis/authApi';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const { content } = useAuth();
    const Logo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrmJyV86m97sc2Pahu8bd8Kbw9-hRQoFSpQ&s';


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
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4'>
            <div className='mb-6'>
                <img
                    src={Logo}
                    alt='Logo'
                    className='w-30 h-30 object-contain sm:w-34 sm:h-34 md:w-38 md:h-38'
                />
            </div>
            <div className='bg-white p-6 rounded w-full max-w-md shadow sm:p-8'>

                <h2 className='text-xl sm:text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2'>
                    ចូលប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រង
                </h2>
                <Form
                    name='login'
                    layout='vertical'
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='username'
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder='ឈ្មោះ'
                            size='large'
                        />
                    </Form.Item>

                    <Form.Item
                        name='password'
                    >
                        <Input.Password
                            prefix={<LockOutlined className='site-form-item-icon' />}
                            placeholder='លេខសម្ងាត់'
                            size='large'
                            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        />
                    </Form.Item>

                    <Form.Item name='remember' valuePropName='checked'>
                        <Checkbox>ចងចាំខ្ញុំ</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            className='w-full'
                            size='large'
                            htmlType="submit" loading={loading}
                        >
                            ចូលប្រើប្រាស់
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;
