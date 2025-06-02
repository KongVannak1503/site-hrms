import { Content } from 'antd/es/layout/layout'
import React, { useContext, useEffect, useState } from 'react'
import { LanguageContext } from '../../../components/Translate/LanguageContext'
import CustomBreadcrumb from '../../../components/utils/CustomBreadcrumb';
import { getRolesApi } from '../../../apis/roleApi';
import { Form, Space, Table, Tooltip } from 'antd';
import { Styles } from '../../../components/utils/CsStyle';
import {
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import RoleCreatePage from './RoleCreatePage';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';

function RolesPage() {
    const { content, accessToken } = useContext(LanguageContext)
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => {
        form.resetFields();
        setOpen(false);
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    }
    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['roles'] }
    ];

    useEffect(() => {
        document.title = content['roles'];
        const fetchData = async () => {
            try {
                const response = await getRolesApi();
                if (Array.isArray(response)) {
                    setRoles(response);
                } else {
                    console.error("Data is not an array:", response);
                    setRoles([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            title: content['role'],
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => <span>{text}</span>,
        },

        {
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {content['action']}
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title={content['edit']}>
                        <button
                            onClick={showDrawer}
                            className={Styles.btnEdit}
                            shape="circle"
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={content['delete']}>
                        <button
                            className={`${Styles.btnDelete}  'cursor-pointer'}`}
                            shape="circle"
                        >
                            <DeleteOutlined />
                        </button>
                    </Tooltip>
                </Space>
            ),
        },
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: changeableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: changeableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

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
                <Table rowSelection={rowSelection} columns={columns} dataSource={roles} rowKey="_id" />

                <ModalLgCenter
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    title="My Custom Modal"
                >
                    <RoleCreatePage form={form} onCancel={closeDrawer} />
                </ModalLgCenter>
            </Content>
        </div>
    );
}

export default RolesPage
