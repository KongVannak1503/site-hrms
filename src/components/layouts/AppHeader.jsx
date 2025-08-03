import { BellOutlined, BulbOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Layout, Select, Space } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import { logout } from '../../utils/auth'
import { MdMenu } from "react-icons/md";
import { Styles } from '../../utils/CsStyle'
import { useEffect, useState } from 'react';
import { getUserApi } from '../../services/userApi';
import uploadUrl from '../../services/uploadApi';
import Assets from '../../assets/Assets';

const { Header } = Layout

const AppHeader = ({ collapsed, toggle, isMobile }) => {
    const { language, setLanguage, identity } = useAuth();

    const items = [
        {
            label: (
                <div>
                    <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
                        {identity?.username}
                    </span>
                    <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                        {identity?.email}
                    </span>
                </div>
            ),
            key: '0',
        },
        {
            label: (
                <ul className="flex flex-col gap-1 border-b border-gray-200 pb-3 pt-4 dark:border-gray-800">
                    <li>
                        <p className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                            <svg className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" fill=""></path>
                            </svg>
                            Edit profile
                        </p>
                    </li>
                </ul>
            ),
            key: '1',
        },
        {
            label: (
                <button onClick={logout} className="cursor-pointer group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                    <svg className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z" fill=""></path>
                    </svg>

                    Sign out
                </button>
            ),
            key: '3',
        },
    ];


    return (
        <Header className='flex justify-between !bg-white !border-b !border-gray-200' style={{ padding: 0, paddingRight: 10, height: 56, overflow: 'hidden' }}>
            <div>
                <Button
                    type="text"
                    className='text-gray-700 dark:!text-gray-400 flex items-center !pt-2'
                    icon={<MdMenu size={25} />}
                    onClick={toggle}
                    style={{
                        width: 64,
                        height: 64,
                    }}
                />
                {/* You can optionally change button behavior or style if isMobile is true */}
            </div>
            <div className='flex items-center'>

                {/* <div>
                    <button>
                        <span className={Styles.btnInfoSm}>
                            People Quit
                        </span>
                    </button>
                </div> */}

                <Select
                    value={language}
                    onChange={setLanguage}
                    variant="borderless"
                    suffixIcon={null}
                    className="w-[50px] !mx-3"
                >
                    <Select.Option value="english">
                        <img
                            src={Assets.en_flag}
                            alt="English"
                            style={{ width: 28, height: 20 }}
                        />
                    </Select.Option>
                    <Select.Option value="khmer">
                        <img
                            src={Assets.kh_flag}
                            alt="Khmer"
                            style={{ width: 28, height: 20, objectFit: 'cover' }}
                        />
                    </Select.Option>
                </Select>
                <div className='mr-4'>
                    <Badge className={`${Styles.btnHeaderIcon}`} size="default" style={{ borderRadius: 50 }} count={5} offset={[3, 10]}>
                        <Avatar shape="circle" icon={<BellOutlined style={{ fontSize: '15px', fontWeight: 'bold' }} />} size={45} />
                    </Badge>
                </div>
                {/* 
                <Button className='mx-2 !text-gray-700 dark:!text-gray-400'
                    type="text"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />} /> */}

                <Dropdown
                    menu={{ items }}
                    trigger={['click']}
                    placement="bottomRight"
                    arrow
                    overlayClassName="w-[250px] !z-[2000]"
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space className='pt-4'>
                            <img
                                className="w-[43px] h-[43px] rounded-full object-cover"
                                src={`${uploadUrl}/${identity?.employeeId?.image_url?.path}`}
                                alt="photo"
                            />
                            <span className="mr-1 block text-theme-sm font-medium text-gray-700 dark:text-gray-400">{identity?.username}</span>
                        </Space>
                    </a>
                </Dropdown>

            </div>

        </Header >
    )
}

export default AppHeader
