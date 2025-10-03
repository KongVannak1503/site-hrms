import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Avatar, Button, DatePicker, Form, Input, message, Select, Space, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, FileTextOutlined, FormOutlined, PlusOutlined, RightCircleOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import uploadUrl from '../../../services/uploadApi';
import { formatDate, formatDateTime } from '../../../utils/utils';
import StatusTag from '../../../components/style/StatusTag';
import { Styles } from '../../../utils/CsStyle';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { deleteAppraisalMonthApi, getAppraisalMonthsApi } from '../../../services/AppraisalApi';
import AppraisalMonthCreatePage from './AppraisalMonthCreatePage';
import AppraisalMonthUpdatePage from './AppraisalMonthUpdatePage';

const AppraisalMonthPage = () => {
    const { isLoading, content, language, identity } = useAuth();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [actionForm, setActionForm] = useState('create');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [searchFilters, setSearchFilters] = useState({
        text: '',
        date: '',
        department: '',
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const navigate = useNavigate();

    const employeePermission = identity?.role?.permissions?.find(
        p => p.permissionId?.name === "appraisals"
    );

    // fallback empty array if not found
    const allowedActions = employeePermission?.actions || [];

    // convert into quick lookup map
    const permissionMap = allowedActions.reduce((acc, action) => {
        acc[action] = true;
        return acc;
    }, {});

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    }

    const [form] = Form.useForm();

    const closeDrawer = () => {
        form.resetFields();
        setOpen(false);
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['appraisal'] }
    ];

    useEffect(() => {
        document.title = `${content['appraisal']} | USEA`;
        const fetchData = async () => {
            try {
                const res = await getDepartmentsApi();
                setDepartments(res)
                const response = await getAppraisalMonthsApi();
                console.log(response)
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

    const handleSearch = (type, value) => {
        const updatedFilters = { ...searchFilters, [type]: value };
        setSearchFilters(updatedFilters);

        const term = updatedFilters.text.trim().toLowerCase();
        const date = updatedFilters.date;
        const department = updatedFilters.department;

        const filtered = users.filter((base) => {
            const matchText =
                (base.department?.title_en || '').toLowerCase().includes(term) ||
                (base.department?.title_kh || '').toLowerCase().includes(term) ||
                (base.startDate || '').toLowerCase().includes(term) ||
                (base.kpiTemplate?.name || '').toLowerCase().includes(term);

            const matchDate = !date || (base.startDate || '').includes(date);
            const matchDepartment =
                !department ||
                (department === 'all' && base.department === null) ||
                base.department?._id === department;

            return matchText && matchDate && matchDepartment;
        });

        setFilteredData(filtered);
    };

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
    const handleDelete = async (id) => {
        try {
            await deleteAppraisalMonthApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success(content['deleteSuccessFully']);
        } catch (error) {
            console.error('Delete failed:', error);
            message.error(content['failedToDelete']);
        }
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

    const columns = [
        {
            title: content['name'],
            dataIndex: "name",
            key: "name",
            render: (text) => <p>{text}</p>,
        },
        {
            title: content['kpi'],
            dataIndex: "kpi",
            key: "kpi",
            render: (_, text) => <p>{text.kpiTemplate?.name}</p>,
        },
        {
            title: content['startDate'],
            dataIndex: "startDate",
            key: "startDate",
            render: (text) => <div>
                <span>{formatDate(text)}</span>
            </div>,
        },
        {
            title: content['endDate'],
            dataIndex: "endDate",
            key: "endDate",
            render: (text) => <div>
                <span>{formatDate(text)}</span>
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
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {content['action']}
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    {permissionMap.update && (
                        <Tooltip title={content['edit']}>
                            <button
                                className={Styles.btnEdit}
                                shape="circle"
                                onClick={() => showUpdateDrawer(record._id)}
                            >
                                <FormOutlined />
                            </button>
                        </Tooltip>
                    )}
                    {permissionMap.delete && ConfirmDeleteButton({
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

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className='text-xl font-extrabold text-[#002060]'><FileTextOutlined className='mr-2' />{content['appraisal']}</h1>
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
                    <div className='flex items-center gap-3'>
                        <Input
                            style={{ width: '150px' }}
                            placeholder={content['searchAction']}
                            onChange={(e) => handleSearch('text', e.target.value)}
                        />

                        <DatePicker
                            style={{ width: '150px' }}
                            placeholder={`${content['date']}`}
                            onChange={(date, dateString) => handleSearch('date', dateString)}
                        />

                        {/* <Select
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            style={{ width: '150px' }}
                            onChange={(value) => handleSearch('department', value)}
                            placeholder={content['department']}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            <Select.Option value='all'>
                                {language === 'khmer' ? 'ទាំងអស់' : 'All'}
                            </Select.Option>
                            {departments.map((department) => (
                                <Select.Option key={department._id || department.id} value={department._id}>
                                    {language === 'khmer' ? department.title_kh : department.title_en}
                                </Select.Option>
                            ))}
                        </Select> */}

                    </div>
                    <button disabled={!permissionMap.create} onClick={showCreateDrawer} className={`${Styles.btnCreate} ${!permissionMap.create ? ' !cursor-not-allowed' : ''} `}> <PlusOutlined /> {`${content['create']} ${content['appraisal']}`}</button>
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
                            ? `${content['create']} ${content['newStart']} ${content['appraisal']}${content['newEnd']}`
                            : `${content['update']} ${content['appraisal']}`
                    }
                >
                    {actionForm === 'create' ? (
                        <AppraisalMonthCreatePage onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                    ) : (
                        < AppraisalMonthUpdatePage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                    )}
                </ModalMdCenter>


            </Content >
        </div >
    )
}

export default AppraisalMonthPage
