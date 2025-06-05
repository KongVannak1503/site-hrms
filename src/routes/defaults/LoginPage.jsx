import React from 'react';
import LoginForm from '../../components/hooks/LoginForm';

const LoginPage = () => {

    const handleLoginSuccess = () => {
        window.location.href = '/';
    };

    return (
        <LoginForm onSuccess={handleLoginSuccess} />
    );
};

export default LoginPage;
