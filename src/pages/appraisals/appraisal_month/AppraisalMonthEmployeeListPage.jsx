import React, { useEffect, useState } from 'react'
// import UserCreate from './UserCreate'
import { Avatar, Breadcrumb, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FileTextOutlined, FormOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDateTime } from '../../../utils/utils';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { Styles } from '../../../utils/CsStyle';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { getEmployeeApi } from '../../../services/employeeApi';
import EmployeeNav from '../../employee/EmployeeNav';
import AppraisalNav from './AppraisalNav';
import { getAppraisalActiveMonthsApi, getAppraisalMonthsApi, getAppraisalsByDepartmentApi } from '../../../services/AppraisalApi';
import StatusTag from '../../../components/style/StatusTag';
import TypeTag from '../../../components/style/TypeTag';

const AppraisalMonthEmployeeListPage = () => {
    const { mainId } = useParams();
    const { isLoading, content, language } = useAuth();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [employee, setEmployee] = useState(false);
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
        document.title = `${content['appraisal']} | USEA`;
        const fetchData = async () => {
            try {
                const resEmp = await getEmployeeApi(mainId);
                setEmployee(resEmp);
                const response = await getAppraisalActiveMonthsApi(mainId);

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
        { breadcrumbName: content['employee'], path: '/appraisal/employee' },
        { breadcrumbName: content['appraisal'] },
        { breadcrumbName: language == 'khmer' ? employee?.name_kh : employee?.name_en },
    ];

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


    const columns = [
        {
            title: content['startDate'],
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
            title: content['status'],
            dataIndex: "status",
            key: "status",
            render: (text) => <StatusTag value={text} />
        },
        {
            title: content['type'],
            dataIndex: "type",
            key: "type",
            render: (text) => <TypeTag value={text} />
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
                            onClick={() => handleUpdate(mainId, record._id)}
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
    const handleAddCreated = () => {
        navigate('/appraisal/kpi/form');
    };
    const handleUpdate = (mainId, id) => {
        navigate(`/appraisal/month/manager/${mainId}/form/${id}`);
    };


    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            {/* <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <AppraisalNav />
            </div> */}
            <div style={{

            }}>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['appraisal']}</p>
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

                </Content >
            </div>
        </div >
    )
}

export default AppraisalMonthEmployeeListPage
