import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Breadcrumb, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { Styles } from '../../../utils/CsStyle';
import { formatDateTime } from '../../../utils/utils';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { deletePositionApi, getPositionsApi } from '../../../services/positionApi';
import CreatePositionPage from './CreatePositionPage';
import UpdatePositionPage from './UpdatePositionPage';

const PositionPage = () => {
    const { isLoading, content, language } = useAuth();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [actionForm, setActionForm] = useState('create');
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
        { breadcrumbName: content['position'] }
    ];

    useEffect(() => {
        document.title = content['position'];
        const fetchData = async () => {
            try {
                const response = await getPositionsApi();
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
            const filtered = users.filter((item) => {
                const title = item.title?.toLowerCase() || '';
                const description = item.description?.toLowerCase() || '';
                const departmentTitle = item.department?.title?.toLowerCase() || '';
                const createdBy = item.createdBy?.username?.toLowerCase() || '';

                return (
                    title.includes(term) ||
                    description.includes(term) ||
                    departmentTitle.includes(term) ||
                    createdBy.includes(term)
                );
            });

            setFilteredData(filtered);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePositionApi(id); // call the API
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
            render: (_, text) => <span>{language == 'khmer' ? text.title_kh : text.title_en}</span>,
        },
        {
            title: content['description'],
            dataIndex: "description",
            key: "description",
            render: (text) => <span>{text || '-'}</span>,
        },
        {
            title: content['department'],
            dataIndex: "department",
            key: "department",
            render: (department) => (
                department?.title ? (
                    <Tag color="gold">{department.title}</Tag>
                ) : (
                    <Tag color="default">-</Tag>
                )
            ),
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
    const handleUpdate = (updatedRole) => {
        if (!updatedRole || !updatedRole._id) {
            console.error("Updated   object does not contain _id:", updatedRole);
            return;
        }
        setUsers((prevRoles) =>
            prevRoles.map(role => (role._id === updatedRole._id ? updatedRole : role))
        );
        setFilteredData((prevFiltered) =>
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
                        <h5 className='text-lg font-semibold'>{content['positions']}</h5>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                size="large"
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={showCreateDrawer} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['position']}`}</button>
                    </div>
                </div>
                <Table
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
                        locale: {
                            items_per_page: content['page'],
                        },
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
                            ? `${content['create']} ${content['newStart']} ${content['position']}${content['newEnd']}`
                            : `${content['update']} ${content['position']}`
                    }
                >
                    {actionForm === 'create' ? (
                        <CreatePositionPage form={form} onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    ) : (
                        <UpdatePositionPage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                </ModalMdCenter>

            </Content >
        </div >
    )
}

export default PositionPage
