import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Breadcrumb, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FileTextOutlined, FormOutlined, PlusOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { Styles } from '../../../utils/CsStyle';
import { formatDateTime, formatYear } from '../../../utils/utils';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import PayrollCreatePage from './PayrollCreatePage';
import { deleteBonusApi, getBonusesApi } from '../../../services/payrollApi';
import PayrollUpdatePage from './PayrollUpdatePage';
import { useNavigate } from 'react-router-dom';

const PayrollPage = () => {
    const { isLoading, content } = useAuth();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [actionForm, setActionForm] = useState('create');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();
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
        { breadcrumbName: content['payroll'] }
    ];

    useEffect(() => {
        document.title = content['payroll'];
        const fetchData = async () => {
            try {
                const response = await getBonusesApi();
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
            const filtered = users.filter((base) =>
                base.title.toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };



    const handleDelete = async (id) => {
        try {
            await deleteBonusApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

    const handleEntrain = (id) => {
        navigate(`/payroll/${id}`);
    };


    const columns = [
        {
            title: "Pay Date",
            dataIndex: "payDate",
            key: "payDate",
            render: (text) => <span>{formatYear(text)}</span>,
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
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {content['action']}
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>

                    <Tooltip title={content['entrain']}>
                        <button
                            className={Styles.btnDownload}
                            shape="circle"
                            onClick={() => handleEntrain(record._id)}
                        >
                            <RightCircleOutlined />
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
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['payroll']}</p>
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
                        <h5 className='text-lg font-semibold'>{content['payroll']}</h5>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                size="large"
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={showCreateDrawer} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['payroll']}`}</button>
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
                            ? `${content['create']} ${content['newStart']} ${content['payroll']}${content['newEnd']}`
                            : `${content['update']} ${content['payroll']}`
                    }
                >
                    {actionForm === 'create' ? (
                        <PayrollCreatePage onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    ) : (
                        <PayrollUpdatePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                </ModalMdCenter>

            </Content >
        </div >
    )
}

export default PayrollPage
