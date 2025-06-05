import React, { useContext, useEffect, useState } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import AppFooter from './AppFooter';
import { Outlet } from 'react-router-dom';
import { LanguageContext } from '../Translate/LanguageContext';
import { Styles } from '../utils/CsStyle';
import { useBreakpoint } from '../hooks/useBreakpoint';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
    const siderWidth = 250;
    const headerHeight = 64;
    const isMobile = useBreakpoint(768);
    const collapsedWidth = isMobile ? 0 : 80;          // true if viewport < 768px
    const [collapsed, setCollapsed] = useState(isMobile);

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Sider
                width={siderWidth}
                collapsible
                collapsed={collapsed}
                collapsedWidth={collapsedWidth}
                onCollapse={(collapse) => setCollapsed(collapse)}
                onBreakpoint={(broken) => setCollapsed(broken)}
                trigger={null}
                className='!border-r !border-gray-200 dark:!border-r dark:!border-gray-800'
                style={{
                    position: isMobile ? 'fixed' : 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 1000,
                    background: '#fff',
                    overflow: 'auto',
                }}
            >
                <AppSider collapsed={collapsed} />
            </Sider>
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.45)] transition-opacity duration-300 "
                    style={
                        { zIndex: 999, }
                    }
                    onClick={() => setCollapsed(true)}
                />
            )}
            {/* Fixed Header */}
            <Header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isMobile ? 0 : (collapsed ? collapsedWidth : siderWidth),
                    width: isMobile ? '100%' : `calc(100% - ${collapsed ? collapsedWidth : siderWidth}px)`,
                    height: headerHeight,
                    transition: 'all 0.3s ease',
                    zIndex: 99,
                    padding: 0,
                }}
            >
                <AppHeader
                    collapsed={collapsed}
                    toggle={() => setCollapsed(!collapsed)}
                    isMobile={isMobile} />
            </Header>
            {/* Main Content + Footer */}
            <Layout

                style={{
                    marginLeft: isMobile ? 0 : (collapsed ? collapsedWidth : siderWidth),
                    marginTop: headerHeight,
                    transition: 'all 0.3s ease',
                }}
            >
                <Content
                    style={{
                        padding: 24,
                        backgroundColor: '#f5f5f5',
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
