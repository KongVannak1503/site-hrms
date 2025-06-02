import React, { createContext, useState, useEffect } from 'react'
import dataTranslate from './Data.json'
import { AccessTokenApi } from '../../apis/authApi'
import { jwtDecode } from 'jwt-decode'

export const LanguageContext = createContext()

// Get initial language synchronously from localStorage
const getInitialLanguage = () => {
    const saved = localStorage.getItem('appLanguage')
    return saved && dataTranslate[saved] ? saved : 'english'
}

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' ? 'dark' : 'light'
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getInitialLanguage)
    const [content, setContent] = useState(dataTranslate[getInitialLanguage()])
    const [theme, setTheme] = useState(getInitialTheme)
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dataTranslate[language]) {
            setContent(dataTranslate[language])
            localStorage.setItem('appLanguage', language)
        }
    }, [language])

    useEffect(() => {
        localStorage.setItem('theme', theme) // <-- renamed here
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])


    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const access = await AccessTokenApi();
                setAccessToken(access.data); // assuming access.data = { user, role }
            } catch (err) {
                console.error('Failed to fetch access token:', err);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAccess();
    }, []);

    useEffect(() => {
        const validateToken = () => {
            const token = localStorage.getItem('token');
            const currentPath = window.location.pathname;

            if (!token) {
                if (currentPath !== '/login') {
                    window.location.href = '/login';
                }
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp * 1000 < Date.now();

                if (isExpired) {
                    localStorage.removeItem('token');
                    if (currentPath !== '/login') {
                        window.location.href = '/login';
                    }
                }
            } catch (err) {
                console.error('Token validation failed:', err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);




    return (
        <LanguageContext.Provider value={{ language, setLanguage, content, theme, setTheme, accessToken, loading }}>
            {children}
        </LanguageContext.Provider>
    )
}
