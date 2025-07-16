import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Avatar, Breadcrumb, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FileTextOutlined, FormOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { Styles } from '../../../utils/CsStyle';
import { formatDateTime } from '../../../utils/utils';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import DepartmentCreatePage from './DepartmentCreatePage';
import DepartmentUpdatePage from './DepartmentUpdatePage';
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { deleteDepartmentApi, getDepartmentsApi } from '../../../services/departmentApi';
import DepartmentAssigneePage from './DepartmentAssigneePage';
import uploadUrl from '../../../services/uploadApi';
import StatusTag from '../../../components/style/StatusTag';

const DepartmentPage = () => {
    const { isLoading, content, language } = useAuth();
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
    const showAssignDrawer = (userId) => {
        setActionForm('assignee');
        setSelectedUserId(userId);
        setOpen(true);
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['departments'] }
    ];

    useEffect(() => {
        document.title = content['departments'];
        const fetchData = async () => {
            try {
                const response = await getDepartmentsApi();
                console.log(response);

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
            const filtered = users.filter((dept) =>
                dept.title?.toLowerCase().includes(term) ||
                dept.description?.toLowerCase().includes(term) ||
                dept.createdBy?.username?.toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDepartmentApi(id); // call the API
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
            title: content['title'],
            dataIndex: "title",
            key: "title",
            render: (_, text) => <span>{language == 'khmer' ? text?.title_kh : text?.title_en}</span>,
        },
        {
            title: content['manager'],
            dataIndex: 'manager',
            key: 'manager',
            align: 'center',
            render: (_, record) => {
                const managers = record.manager || [];

                if (!managers.length) {
                    return <span>-</span>;
                }

                return (
                    <Avatar.Group maxCount={5} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {managers.map(manager => (
                            <Tooltip key={manager._id} title={manager.name_kh}>
                                <Avatar
                                    size={45}
                                    src={manager.image_url?.path ? `${uploadUrl}/${manager.image_url.path}` : null}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {!manager.image_url?.path && (manager.name_kh ? manager.name_kh[0] : '?')}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                );
            }
        },

        {
            title: content['employee'],
            dataIndex: 'employee',
            key: 'employee',
            align: 'center',
            render: (_, record) => {
                const employees = record.employee || [];

                if (!employees.length) {
                    return <span>0</span>;
                }

                return (
                    <div className='text-center'>
                        <Tooltip title={`${employees.length}  ${content['employees']}`}>
                            <Tag color="blue">
                                {employees.length}
                            </Tag>
                        </Tooltip>
                    </div>
                );
            }
        },
        {
            title: content['positions'] || 'Positions',
            dataIndex: "positionCount",
            key: "positionCount",
            align: 'center',
            render: (count) => (
                <div className="text-center">
                    <Tooltip title={`${count} ${content['positions']}`}>
                        <Tag color="blue">
                            {count || 0}
                        </Tag>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: content['description'],
            dataIndex: "description",
            key: "description",
            render: (text) => <span>{text || '-'}</span>,
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
            render: (value) => <StatusTag value={value} />,
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
                    <Tooltip title={content['assignManager']}>
                        <button
                            type="primary"
                            shape="circle"
                            className={Styles.btnDownload}
                            onClick={() => showAssignDrawer(record._id)}
                        >
                            <UserSwitchOutlined />
                        </button>
                    </Tooltip>
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
                console.error("New object does not contain _id:", newUser);
                return;
            }
            setFilteredData((prevData) => [newUser, ...prevData]);
            setUsers((prevData) => [newUser, ...prevData]);

            setOpen(false);

        } catch (error) {
            console.error("Error adding:", error);
        }
    };
    const handleUpdate = (updatedDepartment) => {
        if (!updatedDepartment || !updatedDepartment._id) {
            console.error("Updated object does not contain _id:", updatedDepartment);
            return;
        }

        setUsers((prevDepartments) =>
            prevDepartments.map(dept => {
                if (dept._id === updatedDepartment._id) {
                    return {
                        ...updatedDepartment,
                        positionCount: dept.positionCount // preserve count
                    };
                }
                return dept;
            })
        );

        setFilteredData((prevDepartments) =>
            prevDepartments.map(dept => {
                if (dept._id === updatedDepartment._id) {
                    return {
                        ...updatedDepartment,
                        positionCount: dept.positionCount // preserve count
                    };
                }
                return dept;
            })
        );

        setOpen(false);
    };


    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['departments']}</p>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>
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
                        <div>
                            <Input
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                                allowClear
                            />
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>

                        <button onClick={showCreateDrawer} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['department']}`}</button>
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

                <ModalMdCenter
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={closeDrawer}
                    title={
                        actionForm === 'create'
                            ? `${content['create']} ${content['newStart']} ${content['department']}${content['newEnd']}`
                            : `${content['update']} ${content['department']}`
                    }
                >
                    {actionForm === 'create' && (
                        <DepartmentCreatePage form={form} onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    )}
                    {actionForm === 'update' && (
                        <DepartmentUpdatePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                    {actionForm === 'assignee' && (
                        <DepartmentAssigneePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                </ModalMdCenter>

            </Content >
        </div >
    )
}

export default DepartmentPage
