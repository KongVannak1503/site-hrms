// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd'
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import Logo from '../../assets/log_usea.png';
import { useAuth } from '../../contexts/AuthContext';
import { LoginUser } from '../../services/authApi';
import { attachTokenToApi } from '../../services/api';

const LoginPage = () => {
    const { isLoading, token, setToken, content } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
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
            console.log(err);
            message.error('Login failed');
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
                    className='w-30 object-contain '
                />
            </div>
            <div className='bg-white p-6 rounded w-full max-w-sm shadow sm:p-8'>

                <h2 className='text-xl sm:text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2'>
                    {content['loginToSystem']}
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
                            placeholder={content['username']}
                            size='large'
                            onChange={e => setUsername(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        name='password'
                    >
                        <Input.Password
                            prefix={<LockOutlined className='site-form-item-icon' />}
                            placeholder={content['password']}
                            size='large'
                            onChange={e => setPassword(e.target.value)}
                            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='w-full'
                            size='large'
                        >
                            {content['login']}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
