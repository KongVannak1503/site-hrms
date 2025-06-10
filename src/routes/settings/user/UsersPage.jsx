import React, { useContext, useState } from 'react'
import UserCreate from './UserCreate'
import { Breadcrumb, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';
import ModalLgRight from '../../../components/modals/ModalLgRight';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import hasPermission from '../../../components/hooks/hasPermission';
import CustomBreadcrumb from '../../../components/utils/CustomBreadcrumb';
import { useAuth } from '../../../components/contexts/AuthContext';
import { useEffect } from 'react';
import api from '../../../apis/api';
import { getUsersApi } from '../../../apis/userApi';

const UsersPage = () => {
    const [open, setOpen] = useState(false);
    const { content, accessToken } = useAuth();
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => {
        form.resetFields();
        setOpen(false);
    };
    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['users'] }
    ];
    useEffect(() => {
        document.title = content['roles'];
        const fetchData = async () => {
            try {
                const response = await getUsersApi();
                console.log(response);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [content]);

    return (
        <div>
            <CustomBreadcrumb items={breadcrumbItems} />

            <Content
                className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    minHeight: 800,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >
                {/* <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                    New Account
                </Button> */}
                {hasPermission(accessToken, '/api/users', 'update') && (
                    <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                        New Account
                    </Button>
                )}
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo atque temporibus dolorum sit cum non dolor a, provident facilis, aut reprehenderit sunt quo accusamus inventore voluptate maiores alias laboriosam fuga.
                </p>

                <ModalMdCenter
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    title="My Custom Modal"
                >
                    <UserCreate form={form} onCancel={closeDrawer} />
                </ModalMdCenter>
            </Content>
        </div>
    )
}

export default UsersPage
