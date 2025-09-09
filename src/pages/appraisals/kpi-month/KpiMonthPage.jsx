import React, { useEffect, useState } from 'react'
// import UserCreate from './UserCreate'
import { Avatar, Breadcrumb, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FileTextOutlined, FormOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { deleteMonthKpiApi, duplicateMonthKpiApi, getAllMonthKpiApi } from '../../../services/KpiApi';
import { formatDateTime } from '../../../utils/utils';
import { Styles } from '../../../utils/CsStyle';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { ConfirmDuplicateButton } from '../../../components/button/ConfirmDuplicateButton';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';

const KpiMonthPage = () => {
    const { isLoading, content, language } = useAuth();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllMonthKpiApi();
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

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    }


    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['kpiMonth'] }
    ];

    useEffect(() => {
        document.title = content['kpiMonth'];

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
            await deleteMonthKpiApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success(content['deleteSuccessFully']);
        } catch (error) {
            console.error('Delete failed:', error);
            message.error(content['failedToDelete']);
        }
    };

    const handleDuplicate = async (id) => {
        try {
            const response = await duplicateMonthKpiApi(id);
            if (response?.data) {
                const newItem = response.data;

                // Add new item to beginning of list
                const updatedList = [newItem, ...users];

                setUsers(updatedList);
                setFilteredData(updatedList);
                setPagination(prev => ({
                    ...prev,
                    total: updatedList.length,
                }));
                message.success(content['duplicateSuccessFully']);
            }
        } catch (error) {
            console.error('Duplicate failed:', error);
            message.error(content['failedToDuplicate']);
        }
    };

    const columns = [
        {
            title: content['fromDate'],
            dataIndex: "startDate",
            key: "startDate",
            render: (text) => <span>{formatDateTime(text)}</span>
        },
        {
            title: content['toDate'],
            dataIndex: "endDate",
            key: "endDate",
            render: (text) => <span>{formatDateTime(text)}</span>
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
                    {ConfirmDuplicateButton({
                        onConfirm: () => handleDuplicate(record._id),
                        tooltip: content['duplicate'],
                        title: content['Duplicate'],
                        okText: content['yes'],
                        cancelText: content['no'],
                        description: `${'this item'}?`
                    })}
                    <Tooltip title={content['edit']}>
                        <button
                            className={Styles.btnEdit}
                            shape="circle"
                            onClick={() => handleUpdate(record._id)}
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
    const handleAddCreated = () => {
        navigate('/appraisal/kpi/month/form');
    };
    const handleUpdate = (id) => {
        navigate(`/appraisal/kpi/month/update/${id}`);
    };


    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['kpiMonth']}</p>
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

                        <button onClick={() => handleAddCreated()} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['kpi']}`}</button>
                    </div>
                </div>
                <Table
                    className='custom-pagination custom-checkbox-table'
                    scroll={{ x: 'max-content' }}
                    // rowSelection={rowSelection}
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

            </Content >
        </div >
    )
}

export default KpiMonthPage
