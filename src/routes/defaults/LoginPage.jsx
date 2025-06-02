import React from 'react';
import LoginForm from '../../components/hooks/LoginForm';

const LoginPage = () => {

    const handleLoginSuccess = () => {
        window.location.href = '/';
    };

    return (
        <div className="w-[400px] mx-auto mt-10">
            {/* <h2 className="text-xl mb-4">Login</h2> */}
            <div className="mb-5">
                <img className='mx-auto' width={180} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrmJyV86m97sc2Pahu8bd8Kbw9-hRQoFSpQ&s" alt="" />
            </div>
            <LoginForm onSuccess={handleLoginSuccess} />
        </div>
    );
};

export default LoginPage;
