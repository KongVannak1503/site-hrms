import React, { useContext, useState } from 'react'
import UserCreate from './UserCreate'
import { Breadcrumb, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';
import ModalLgRight from '../../../components/modals/ModalLgRight';
import { Content } from 'antd/es/layout/layout';
import { LanguageContext } from '../../../components/Translate/LanguageContext';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import hasPermission from '../../../components/hooks/hasPermission';
import CustomBreadcrumb from '../../../components/utils/CustomBreadcrumb';

const Users = () => {
    const [open, setOpen] = useState(false);
    const { content, accessToken } = useContext(LanguageContext)
    const [form] = Form.useForm();

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => {
        form.resetFields();
        setOpen(false);
    };
    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['users'] }
    ];

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

export default Users
