import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Breadcrumb, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useEffect } from 'react';
import OrganizationCreatePage from './OrganizationCreatePage';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { Styles } from '../../../utils/CsStyle';
import { formatDateTime } from '../../../utils/utils';
import { deleteOrganizationApi, getOrganizationsApi } from '../../../services/organizationApi';
import OrganizationUpdatePage from './OrganizationUpdatePage';

const OrganizationPage = () => {
    const { isLoading, content } = useAuth();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [actionForm, setActionForm] = useState('create'); // 'create' or 'update'
    const [selectedUserId, setSelectedUserId] = useState(null);
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
        setSelectedUserId(null);
        setOpen(true);
    };

    const showUpdateDrawer = (userId) => {
        setActionForm('update');
        setSelectedUserId(userId);
        setOpen(true);
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['organizations'] }
    ];

    useEffect(() => {
        document.title = content['organizations'];
        const fetchData = async () => {
            try {
                const response = await getOrganizationsApi();
                if (Array.isArray(response)) {
                    setUsers(response);
                    setFilteredData(response);
                    setPagination(prev => ({
                        ...prev,
                        total: response.length,
                    }));
                } else {
                    console.error('Data is not an array:', response);
                    setUsers([]);
                    setFilteredData([]);
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
            setFilteredData(users);
        } else {
            const filtered = users.filter((base) =>
                base.title.toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };



    const handleDelete = async (id) => {
        try {
            await deleteOrganizationApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

    const columns = [
        {
            title: content['name'],
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: content['nameFull'],
            dataIndex: "fullname",
            key: "fullname",
            render: (text) => <span>{text}</span>,
        },
        {
            title: content['email'],
            dataIndex: "email",
            key: "email",
            render: (text) => <span>{text}</span>,
        },
        {
            title: content['phone'],
            dataIndex: "phone",
            key: "phone",
            render: (text) => <span>{text}</span>,
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => <div>
                <span>{formatDateTime(text)}</span>
                <p>{record.createdBy ? `Created by: ${record.createdBy?.username}` : ''}</p>
            </div>,
        },
        {
            title: content['status'],
            dataIndex: "isActive",
            key: "isActive",
            render: (text) => {
                const isActive = Boolean(text); // ensure it's a boolean
                const color = isActive ? 'geekblue' : 'volcano';
                const label = isActive ? 'ACTIVE' : 'INACTIVE';

                return (
                    <Tag color={color} key={String(text)}>
                        {label}
                    </Tag>
                );
            }
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
    const handleAddCreated = (newOrg) => {
        if (!newOrg || !newOrg._id) {
            console.error("New organization missing _id:", newOrg);
            return;
        }

        // Set all other organizations inactive, only newOrg is active
        setUsers((prev) => {
            return prev.map(org => ({
                ...org,
                isActive: org._id === newOrg._id // only new one active
                    ? true
                    : false,
            }));
        });

        setFilteredData((prev) => {
            // If filteredData is different from users, also update similarly
            return prev.map(org => ({
                ...org,
                isActive: org._id === newOrg._id
                    ? true
                    : false,
            }));
        });

        // Add the new org at the front of the list (optional)
        setUsers((prev) => [newOrg, ...prev]);
        setFilteredData((prev) => [newOrg, ...prev]);

        setOpen(false);
    };

    const handleUpdate = (updatedOrg) => {
        if (!updatedOrg || !updatedOrg._id) {
            console.error("Updated object does not contain _id:", updatedOrg);
            return;
        }

        setUsers((prevOrgs) => {
            // Map through previous orgs
            return prevOrgs.map(org => {
                // Set the updated org with new data
                if (org._id === updatedOrg._id) return updatedOrg;

                // If the updated org isActive true, set others to false
                if (updatedOrg.isActive) {
                    return { ...org, isActive: false };
                }

                return org;
            });
        });

        setFilteredData((prevFiltered) => {
            return prevFiltered.map(org => {
                if (org._id === updatedOrg._id) return updatedOrg;
                if (updatedOrg.isActive) {
                    return { ...org, isActive: false };
                }
                return org;
            });
        });

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
                        <h5 className='text-lg font-semibold'>{content['organizations']}</h5>
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
                    className="custom-pagination custom-checkbox-table"
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredData}
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
                            ? `${content['create']} ${content['newStart']} ${content['organization']}${content['newEnd']}`
                            : `${content['update']} ${content['organization']}`
                    }
                >
                    {actionForm === 'create' ? (
                        <OrganizationCreatePage form={form} onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    ) : (
                        <OrganizationUpdatePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                </ModalLgCenter>

            </Content >
        </div >
    )
}

export default OrganizationPage
