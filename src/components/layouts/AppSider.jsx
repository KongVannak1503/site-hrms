import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LanguageContext } from '../Translate/LanguageContext'

const AppSider = ({ collapsed }) => {
    const { content } = useContext(LanguageContext)
    const { theme } = useContext(LanguageContext)
    const navigate = useNavigate()
    const location = useLocation()

    const employeeItems = [
        {
            key: '/dashboard',
            icon: <AppstoreOutlined />,
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
        {
            key: '/users',
            icon: <UserOutlined />,
            label: 'User',
        },
    ]

    const recruitmentItems = [
        {
            key: '/job',
            icon: <SettingOutlined />,
            label: content['job'] || 'Job',
        },
        {
            key: '/job-application',
            icon: <SettingOutlined />,
            label: content['jobApplication'] || 'Job Application',
        },
    ]

    const settingsMenuItem = [
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: content['settings'] || 'Settings',
        },
    ]

    return (
        <>
            {/* Logo section */}
            <div
                className='!bg-white !border-r !border-gray-200 dark:!border-gray-800 dark:!bg-gray-900'
                style={{ textAlign: 'center', padding: '10px 16px 16px' }}
            >
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

            {/* Main menu */}
            <Menu
                theme={theme}
                className='!border-r !border-gray-200 dark:!border-gray-800'
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                items={employeeItems}
            />

            <Menu
                theme={theme}
                className='!border-t !border-gray-200 dark:!border-gray-800 !border-r !border-l-0 !border-b-0'
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                items={recruitmentItems}
            />

            {/* Settings menu with top border */}
            <Menu
                theme={theme}
                className='!border-t !border-gray-200 dark:!border-gray-800 !border-r !border-l-0 !border-b-0'
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                items={settingsMenuItem}
            />
        </>
    )
}

export default AppSider
