import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../apis/api';
import { useAuth } from '../../components/contexts/AuthContext';
import { Content } from 'antd/es/layout/layout';
import { Spin } from 'antd';
import FullScreenLoader from '../../components/utils/FullScreenLoader';

const Dashboard = () => {
    const { isLoading, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const res = await api.get('/users/users');
                setLoading(false); // Permission okay, show dashboard
            } catch (err) {
                const status = err.response?.status;
                if (status === 401) {
                    navigate('/login', { replace: true });
                } else if (status === 403) {
                    navigate('/unauthorized', { replace: true });
                } else {
                    console.error('Unexpected error:', err);
                }
            }
        };

        fetchUser();
    }, [token, navigate]);


    if (isLoading) {
        return <FullScreenLoader />;
    }

    return <Content
        className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
        style={{
            padding: 24,
            minHeight: 800,
            borderRadius: 8,
            marginTop: 10,
        }}
    >
        Dashboard
    </Content>;
};

export default Dashboard;
