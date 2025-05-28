import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import AppFooter from './AppFooter';
import { Outlet } from 'react-router-dom';
import { LanguageContext } from '../Translate/LanguageContext';
import { Styles } from '../utils/CsStyle';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { theme, setTheme } = useContext(LanguageContext)
    const siderWidth = 200;
    const headerHeight = 64;

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: theme == "light" ? '#f5f5f5' : Styles.darkMode, }}>
            <Sider
                width={siderWidth}
                collapsible
                collapsed={collapsed}
                trigger={null}
                className='!border-r !border-gray-200 dark:!border-r dark:!border-gray-800'
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 1000,
                    background: theme == 'light' ? '#fff' : '',
                    overflow: 'auto',
                }}
            >
                <AppSider collapsed={collapsed} />
            </Sider>

            {/* Fixed Header */}
            <Header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: collapsed ? 80 : siderWidth,
                    width: `calc(100% - ${collapsed ? 80 : siderWidth}px)`,
                    height: headerHeight,
                    transition: 'all 0.3s ease',
                    zIndex: 99,
                    padding: 0,
                }}
            >
                <AppHeader collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
            </Header>
            {/* Main Content + Footer */}
            <Layout

                style={{
                    marginLeft: collapsed ? 80 : siderWidth,
                    marginTop: headerHeight,
                    transition: 'all 0.3s ease',
                }}
            >
                <Content
                    style={{
                        padding: 24,
                        backgroundColor: theme == "light" ? '#f5f5f5' : Styles.darkMode,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center', background: '#fff' }}>
                    <AppFooter />
                </Footer>
            </Layout>
        </Layout >
    );
};

export default MainLayout;
