// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';       // import useNavigate
import api, { attachTokenToApi } from '../../apis/api';
import { useAuth } from '../../components/contexts/AuthContext';
import { Button, Checkbox, Form, Input, Spin } from 'antd'
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { LoginUser } from '../../apis/authApi';

const LoginPage = () => {
    const { isLoading, token, setToken } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const Logo = 'https://www.usea.edu.kh/media/logo_update.png';
    useEffect(() => {
        if (token) {
            navigate('/', { replace: true }); // or your desired protected page
        }
    }, [token, navigate]);// initialize navigate

    const handleLogin = async (values) => {
        const { username, password } = values;
        try {
            const res = await LoginUser(username, password);
            const accessToken = res.data.accessToken;
            setToken(accessToken);
            attachTokenToApi(accessToken);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><Spin size="large" /></div>;
    }
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
                    initialValues={{ remember: true }}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name='username'
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder='ឈ្មោះ'
                            size='large'
                            onChange={e => setUsername(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        name='password'
                    >
                        <Input.Password
                            prefix={<LockOutlined className='site-form-item-icon' />}
                            placeholder='លេខសម្ងាត់'
                            size='large'
                            onChange={e => setPassword(e.target.value)}
                            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        />
                    </Form.Item>

                    <Form.Item name='remember' valuePropName='checked'>
                        <Checkbox>ចងចាំខ្ញុំ</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='w-full'
                            size='large'
                        >
                            ចូលប្រើប្រាស់
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
