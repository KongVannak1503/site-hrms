import { Content } from 'antd/es/layout/layout'
import React, { useContext, useEffect, useState } from 'react'
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Form, Input, message, Space, Table, Tooltip } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import {
    SearchOutlined,
    FormOutlined,
    DeleteOutlined,
    FileAddFilled,
    PlusOutlined,
} from "@ant-design/icons";
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import RoleCreatePage from './RoleCreatePage';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';
import { formatDateTime } from '../../../utils/utils';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import RoleUpdatePage from './RoleUpdatePage';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { deleteRoleApi, getRolesApi } from '../../../services/roleApi';

function RolesPage() {
    const { isLoading, content } = useAuth();
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [actionForm, setActionForm] = useState('create'); // 'create' or 'update'
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [form] = Form.useForm();

    const closeDrawer = () => {
        form.resetFields();
        setOpen(false);
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    }

    const showCreateDrawer = () => {
        setActionForm('create');
        setSelectedRoleId(null);
        setOpen(true);
    };

    const showUpdateDrawer = (roleId) => {
        setActionForm('update');
        setSelectedRoleId(roleId);
        setOpen(true);
    };

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
                    setFilteredRoles(response);
                    setPagination(prev => ({
                        ...prev,
                        total: response.length,
                    }));
                } else {
                    console.error('Data is not an array:', response);
                    setRoles([]);
                    setFilteredRoles([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [content]);

    const handleSearch = (value) => {
        const term = value.trim().toLowerCase();
        if (!term) {
            setFilteredRoles(roles);
        } else {
            const filtered = roles.filter((role) =>
                role.name.toLowerCase().includes(term)
            );
            setFilteredRoles(filtered);
        }
    };



    const handleDelete = async (id) => {
        try {
            await deleteRoleApi(id); // call the API
            const updatedRoles = roles.filter(role => role._id !== id);
            setRoles(updatedRoles);
            setFilteredRoles(updatedRoles);
            message.success('Role deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete role');
        }
    };

    const columns = [
        {
            title: content['role'],
            dataIndex: "name",
            key: "name",
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
                            className={Styles.btnEdit}
                            shape="circle"
                            onClick={() => showUpdateDrawer(record._id)}
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    {ConfirmDeleteButton({
                        onConfirm: () => handleDelete(record._id),
                        tooltip: content['delete'],
                        title: content['confirmDelete'],
                        okText: content['yes'],
                        cancelText: content['no'],
                        description: `${content['areYouSureToDelete']} ${record.name || 'this item'}?`
                    })}
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
    const handleAddCreated = async (newUser) => {
        try {
            if (!newUser || !newUser._id) {
                console.error("New user object does not contain _id:", newUser);
                return;
            }
            setFilteredRoles((prevData) => [newUser, ...prevData]);
            setRoles((prevData) => [newUser, ...prevData]);

            setOpen(false);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };
    const handleUpdate = (updatedRole) => {
        if (!updatedRole || !updatedRole._id) {
            console.error("Updated role object does not contain _id:", updatedRole);
            return;
        }
        setRoles((prevRoles) =>
            prevRoles.map(role => (role._id === updatedRole._id ? updatedRole : role))
        );
        setFilteredRoles((prevFiltered) =>
            prevFiltered.map(role => (role._id === updatedRole._id ? updatedRole : role))
        );

        setOpen(false);
    };


    if (isLoading) {
        return <FullScreenLoader />;
    }
    return (
        <div>
            <CustomBreadcrumb items={breadcrumbItems} />
            <Content
                className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >
                <div className='block sm:flex justify-between items-center mb-4'>
                    <div className='mb-3 sm:mb-1'>
                        <h5 className='text-lg font-semibold'>{content['roles']}</h5>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                size="large"
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={showCreateDrawer} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['role']}`}</button>
                    </div>
                </div>
                <Table
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredRoles}
                    rowKey="_id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} ${content['of']} ${total} ${content['items']}`,
                        onChange: (page, pageSize) => {
                            setPagination({
                                ...pagination,
                                current: page,
                                pageSize: pageSize,
                            });
                        }
                    }}
                />

                <ModalLgCenter
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={closeDrawer}
                    title={
                        actionForm === 'create'
                            ? `${content['create']} ${content['new']} ${content['role']}`
                            : `${content['update']} ${content['role']}`
                    }
                >
                    {actionForm === 'create' ? (
                        <RoleCreatePage form={form} onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    ) : (
                        <RoleUpdatePage onUserUpdated={handleUpdate} roleId={selectedRoleId} onCancel={closeDrawer} />
                    )}
                </ModalLgCenter>

            </Content >
        </div >
    );
}

export default RolesPage
