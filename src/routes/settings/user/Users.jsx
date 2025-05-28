import React, { useState } from 'react'
import UserCreate from './UserCreate'
import { Breadcrumb, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';
import ModalLgRight from '../../../components/modals/ModalLgRight';
import { Content } from 'antd/es/layout/layout';

const Users = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => {
        form.resetFields();
        setOpen(false);
    };
    const handleSubmit = (values) => {
        console.log('Form values:', values);
        closeDrawer();
    };

    return (
        <div>
            <Breadcrumb
                className="text-gray-700 dark:text-gray-400"
                separator={<span className="text-gray-700 dark:text-gray-400">/</span>}
                itemRender={(route, params, routes, paths) => (
                    <span className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white/90">
                        {route.breadcrumbName}
                    </span>
                )}
                items={[
                    { breadcrumbName: 'Home' },
                    { breadcrumbName: 'Application Center' },
                    { breadcrumbName: 'Application List' },
                    { breadcrumbName: 'App' },
                ]}
            />

            <Content
                className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    minHeight: 800,
                    // backgroundColor: theme == "light" ? Styles.lightMode : Styles.darkMode,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >
                <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                    New Account
                </Button>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo atque temporibus dolorum sit cum non dolor a, provident facilis, aut reprehenderit sunt quo accusamus inventore voluptate maiores alias laboriosam fuga.
                </p>

                <ModalLgRight
                    title="Create a new account"
                    visible={open}
                    onClose={closeDrawer}
                >
                    <UserCreate form={form} />
                </ModalLgRight>
            </Content>
        </div>
    )
}

export default Users
