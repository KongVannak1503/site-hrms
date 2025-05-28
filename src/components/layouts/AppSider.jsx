import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LanguageContext } from '../Translate/LanguageContext'

const AppSider = ({ collapsed }) => {
    const { content } = useContext(LanguageContext)
    const { theme, setTheme } = useContext(LanguageContext)
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        {
            key: '/dashboard',
            icon: <UserOutlined />,
            label: content['dashboard'],
        },
        {
            key: '/test',
            icon: <VideoCameraOutlined />,
            label: 'Test',
        },
        {
            key: '/table',
            icon: <UploadOutlined />,
            label: 'Table',
        },
    ]

    return (
        <>
            <div className='!bg-white !border-r !border-gray-200 dark:!border-r dark:!border-gray-800 dark:!bg-gray-900' style={{ textAlign: 'center', padding: '10px 16px 16px' }}>
                <img
                    src={
                        collapsed
                            ? 'https://www.usea.edu.kh/media/logo_update.png'
                            : 'https://www.usea.edu.kh/media/title/usea-title-1.png'
                    }
                    alt="Logo"
                    style={{
                        maxWidth: '100%',
                        height: collapsed ? 40 : 60,
                        objectFit: 'contain',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate("/dashboard")}
                />
            </div>

            <Menu
                theme={theme}
                className='!border-r !border-gray-200 dark:!border-r dark:!border-gray-800'
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                items={menuItems}
            />
        </>
    )
}

export default AppSider
