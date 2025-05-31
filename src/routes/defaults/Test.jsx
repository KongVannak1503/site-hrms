import React, { useEffect } from 'react'
import { useState } from 'react';
import { AccessTokenApi } from '../../apis/authApi';

const Test = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {

            try {
                const access = await AccessTokenApi();
                console.log(access);

                setError(null);
            } catch (err) {
                setError(err.message || 'Error occurred');
                setResponse(null);
            }
        };
        fetchData();
    }, []);



    return (
        <div>
            <button >Call Test API</button>

            <div>.</div>
        </div>
    )
}

export default Test
