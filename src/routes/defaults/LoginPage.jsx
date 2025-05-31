import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/hooks/LoginForm';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (data) => {
        navigate('/');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            {/* <h2 className="text-xl mb-4">Login</h2> */}
            <LoginForm onSuccess={handleLoginSuccess} />
        </div>
    );
};

export default LoginPage;
