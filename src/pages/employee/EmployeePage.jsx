import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Avatar, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useEffect } from 'react';
import EmployeeCreatePage from './EmployeeCreatePage';
import { useAuth } from '../../contexts/AuthContext';
import { deleteEmployeeApi, getEmployeesApi } from '../../services/employeeApi';
import { formatDateTime } from '../../utils/utils';
import { Styles } from '../../utils/CsStyle';
import { ConfirmDeleteButton } from '../../components/button/ConfirmDeleteButton ';
import ModalLgCenter from '../../components/modals/ModalLgCenter';
import CustomBreadcrumb from '../../components/breadcrumb/CustomBreadcrumb';
import FullScreenLoader from '../../components/loading/FullScreenLoader';
import uploadUrl from '../../services/uploadApi';
import EmployeeUpdatePage from './EmployeeUpdatePage';
import { useNavigate } from 'react-router-dom';
import StatusTag from '../../components/style/StatusTag';

const EmployeePage = () => {
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
    const navigate = useNavigate();

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
    const handleView = (userId) => {
        navigate(`/employee/update/${userId}`);
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employees'] }
    ];

    useEffect(() => {
        document.title = content['employees'];
        const fetchData = async () => {
            try {
                const response = await getEmployeesApi();
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
                (base.first_name_en || '').toLowerCase().includes(term) ||
                (base.first_name_kh || '').toLowerCase().includes(term) ||
                (base.last_name_en || '').toLowerCase().includes(term) ||
                (base.last_name_kh || '').toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };
    const handleUpdateNav = (id) => {
        navigate(`/employee/update/${id}`);
    };
    const handleDelete = async (id) => {
        try {
            await deleteEmployeeApi(id); // call the API
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
            title: content['image'],
            dataIndex: "image_url",
            key: "image_url",
            render: (text, record) =>
                // <Avatar
                //     size={40}
                //     src={`${uploadUrl}/${record.image_url?.path}`}
                // />
                <img
                    src={`${uploadUrl}/${record.image_url?.path}`}
                    alt="photo"
                    width={60}
                    height={60}
                    style={{ borderRadius: '5px', objectFit: 'cover' }}
                />
        },

        {
            title: content['firstName'],
            dataIndex: "first_name",
            key: "first_name",
            render: (text, record) =>
                <div>
                    <p>{record.first_name_kh}</p>
                    <p>{record.first_name_en}</p>
                </div>,
        },
        {
            title: content['lastName'],
            dataIndex: "last_name",
            key: "last_name",
            render: (text, record) =>
                <div>
                    <p>{record.last_name_kh}</p>
                    <p>{record.last_name_en}</p>
                </div>,
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
                    <Tooltip title={content['edit']}>
                        <button
                            className={Styles.btnEdit}
                            shape="circle"
                            onClick={() => handleUpdateNav(record._id)}
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

    const handleCreate = () => {
        navigate('/employee/create');
    };



    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មានបុគ្គលិក</h1>
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
                        {/* <h5 className='text-lg font-semibold'>{content['employees']}</h5> */}
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                // size="large"
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={handleCreate} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['employee']}`}</button>
                    </div>
                </div>
                <Table
                    className='custom-pagination custom-checkbox-table'
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

                {/* <ModalLgCenter
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={closeDrawer}
                    title={
                        actionForm === 'create'
                            ? `${content['create']} ${content['newStart']} ${content['employee']}${content['newEnd']}`
                            : `${content['update']} ${content['employee']}`
                    }
                >
                    {actionForm === 'create' ? (
                        <EmployeeCreatePage form={form} onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    ) : (
                        <EmployeeUpdatePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                </ModalLgCenter> */}

            </Content >
        </div >
    )
}

export default EmployeePage
