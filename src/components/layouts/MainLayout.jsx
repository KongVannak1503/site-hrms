import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import AppFooter from './AppFooter';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useShowTabHeader } from './TabHeader';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
    const siderWidth = 250;
    const headerHeight = 56;
    const isMobile = useBreakpoint(768);
    const collapsedWidth = isMobile ? 0 : 80;          // true if viewport < 768px
    const [collapsed, setCollapsed] = useState(true);

    // Add paths here where you want to show TabHeader
    const showTabHeader = useShowTabHeader();

    useEffect(() => {
        // if (showTabHeader) {
        // setCollapsed(!isMobile);
        // } else {
        //     setCollapsed(isMobile);
        // }
    }, [isMobile, showTabHeader]);

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
                className='!border-r !border-gray-200'
                style={{
                    position: isMobile ? 'fixed' : 'fixed',
                    top: 0,
                    left: 0,
                    backgroundColor: "#fff",
                    height: '100vh',
                    zIndex: 1000,
                    overflow: 'auto',
                }}
            >
                <AppSider collapsed={collapsed} />
            </Sider>
            {isMobile && !collapsed && (
                <div
                    className="fixed inset-0 transition-opacity duration-300 "
                    style={
                        { zIndex: 999, }
                    }
                    onClick={() => setCollapsed(true)}
                />
            )}
            {/* Fixed Header */}
            <Header
                className='!shadow'
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isMobile ? 0 : (collapsed ? collapsedWidth : siderWidth),
                    width: isMobile ? '100%' : `calc(100% - ${collapsed ? collapsedWidth : siderWidth}px)`,
                    height: headerHeight,
                    transition: 'all 0.3s ease',
                    zIndex: 99,
                    padding: 0,
                    // overflow: 'hidden'
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
                        padding: showTabHeader ? 0 : 24,
                        backgroundColor: '#f6f7f9',
                    }}
                >
                    <Outlet />
                </Content>
                {/* <Footer style={{ textAlign: 'center', background: '#fff' }}>
                    <AppFooter />
                </Footer> */}
            </Layout>
        </Layout >
    );
};

export default MainLayout;
