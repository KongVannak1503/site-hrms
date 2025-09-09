import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Avatar, Button, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, FileTextOutlined, FormOutlined, PlusOutlined, RightCircleOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { getAllEmployeesForManagerApi } from '../../../../services/employeeApi';
import uploadUrl from '../../../../services/uploadApi';
import { Styles } from '../../../../utils/CsStyle';
import FullScreenLoader from '../../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../../components/breadcrumb/CustomBreadcrumb';
import StatusTag from '../../../../components/style/StatusTag';

const AppraisalMonthEmployeePathPage = () => {
    const { isLoading, content, language } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const navigate = useNavigate();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    }



    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'] }
    ];

    useEffect(() => {
        document.title = `${content['appraisal']} | USEA`;
        const fetchData = async () => {
            try {
                const response = await getAllEmployeesForManagerApi();
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
                (base.first_name_en || '').toLowerCase().includes(term) ||
                (base.first_name_kh || '').toLowerCase().includes(term) ||
                (base.last_name_en || '').toLowerCase().includes(term) ||
                (base.last_name_kh || '').toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };

    const handleEntrain = (id) => {
        navigate(`/appraisal/employee/list/path-m/${id}`);
    };


    const columns = [
        {
            title: content['image'],
            dataIndex: "image_url",
            key: "image_url",
            render: (text, record) =>
                <img
                    src={`${uploadUrl}/${record.image_url?.path}`}
                    alt="photo"
                    className="w-[70px] h-[80px] rounded object-cover"
                />
        },
        {
            title: content['name'],
            dataIndex: "name",
            key: "name",
            render: (text, record) =>
                <div>
                    <p>{language == 'khmer' ? record.name_kh : record.name_en}</p>
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
                    <Tooltip title={content['entrain']}>
                        <button
                            className={Styles.btnDownload}
                            shape="circle"
                            onClick={() => handleEntrain(record._id)}
                        >
                            <RightCircleOutlined />
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
                    {/* <div className='mb-3 sm:mb-1'>
                        <p className='text-default text-sm font-bold'>
                            {content['employees']}
                        </p>
                    </div> */}
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                // size="large"
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
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
        </div >
    )
}

export default AppraisalMonthEmployeePathPage
