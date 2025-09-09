import { DollarOutlined, FileTextOutlined, FormOutlined, PlusOutlined, } from '@ant-design/icons';
import { useAuth } from '../../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../../components/breadcrumb/CustomBreadcrumb';
import { Avatar, Button, Checkbox, Form, Input, message, Select, Space, Table, Tooltip } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { deletePayrollApi } from '../../../../services/payrollApi';
import { formatDateTime } from '../../../../utils/utils';
import { Styles } from '../../../../utils/CsStyle';
import FullScreenLoader from '../../../../components/loading/FullScreenLoader';
import { Content } from 'antd/es/layout/layout';
import { getEmployeesApi } from '../../../../services/employeeApi';
import uploadUrl from '../../../../services/uploadApi';
import { getDepartmentsApi } from '../../../../services/departmentApi';
import SubPayrollFormPage from './SubPayrollFormPage';
import ModalMdCenter from '../../../../components/modals/ModalMdCenter';
import { useParams } from 'react-router-dom';

const SubPayrollPage = () => {
    const { content, isLoading, language } = useAuth();
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [actionForm, setActionForm] = useState('create');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [employeeList, setEmployeeList] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['seniorityPayment'], path: '/payroll' },
        { breadcrumbName: content['Employee'] },
    ];

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

    useEffect(() => {
        document.title = content['payroll'];
        const fetchData = async () => {
            try {
                const response = await getEmployeesApi();
                console.log(response);

                const resDepartments = await getDepartmentsApi();
                setDepartments(resDepartments);


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
    }, [content, language]);

    const handleSearch = (value) => {
        const term = value.trim().toLowerCase();

        let filtered = [...users];

        if (term) {
            filtered = filtered.filter((user) => {
                const nameKh = user?.name_kh?.toLowerCase() || '';
                const nameEn = user?.name_en?.toLowerCase() || '';
                const departmentKh = user?.positionId?.department?.title_kh?.toLowerCase() || '';
                const departmentEn = user?.positionId?.department?.title_en?.toLowerCase() || '';

                return (
                    nameKh.includes(term) ||
                    nameEn.includes(term) ||
                    departmentKh.includes(term) ||
                    departmentEn.includes(term)
                );
            });
        }

        if (selectedDepartment) {
            filtered = filtered.filter(user =>
                user?.positionId?.department?._id === selectedDepartment
            );
        }

        setFilteredData(filtered);
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
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <p>{language == 'khmer' ? record?.name_kh : record?.name_en}</p>,
        },
        {
            title: content['department'],
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (text, record) => <p>{language == 'khmer' ? record?.positionId?.department.title_kh : record?.positionId?.department.title_en}</p>,
        },
        {
            title: content['position'],
            dataIndex: 'position',
            key: 'position',
            render: (text, record) => <p>{language == 'khmer' ? record?.positionId?.department.title_kh : record?.positionId?.department.title_en}</p>,
        },
        {
            title: `6 ${content['months']}`,
            dataIndex: '6months',
            key: '6months',
            render: (_, record) => {
                const bonusMatch = record?.subBonus?.find(b => b.bonusId?._id === id);
                return (
                    <Checkbox checked={bonusMatch?.isSix === true} disabled />
                );
            }
        },
        {
            title: `12 ${content['months']}`,
            dataIndex: '12months',
            key: '12months',
            render: (_, record) => {
                const bonusMatch = record?.subBonus?.find(b => b.bonusId?._id === id);
                return (
                    <Checkbox checked={bonusMatch?.isTwelve === true} disabled />
                );
            }
        },
        {
            title: content['total'],
            dataIndex: 'total',
            key: 'total',
            render: (_, record) => {
                const bonusMatch = record?.subBonus?.find(b => b.bonusId?._id === id);
                return (
                    <span>$ {bonusMatch?.total}</span>
                );
            }
        },
        {
            title: content['action'],
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title={content['Bonus']}>
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
        }
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
    const handleUpdate = (updatedSubBonus) => {
        if (!updatedSubBonus || !updatedSubBonus._id) return;

        // Ensure bonusId is an object
        const formattedSubBonus = {
            ...updatedSubBonus,
            bonusId: { _id: updatedSubBonus.bonusId }
        };

        setUsers(prevUsers =>
            prevUsers.map(user => {
                if (user._id === selectedUserId) {
                    const newSubBonus = [...user.subBonus];
                    const index = newSubBonus.findIndex(sb => sb._id === formattedSubBonus._id);

                    if (index !== -1) {
                        newSubBonus[index] = formattedSubBonus;
                    } else {
                        newSubBonus.push(formattedSubBonus);
                    }

                    return { ...user, subBonus: newSubBonus };
                }
                return user;
            })
        );

        setFilteredData(prevFiltered =>
            prevFiltered.map(user => {
                if (user._id === selectedUserId) {
                    const newSubBonus = [...user.subBonus];
                    const index = newSubBonus.findIndex(sb => sb._id === formattedSubBonus._id);

                    if (index !== -1) {
                        newSubBonus[index] = formattedSubBonus;
                    } else {
                        newSubBonus.push(formattedSubBonus);
                    }

                    return { ...user, subBonus: newSubBonus };
                }
                return user;
            })
        );

        setOpen(false);
    };



    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['seniorityPayment']}</p>
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
                    <div className='mb-3 sm:mb-1 flex items-center gap-4'>
                        <div>
                            <Input
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                style={{ width: '180px' }}
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                placeholder={`${content['select']} ${content['department']}`}
                            >
                                {departments.map((department) => (
                                    <Select.Option key={department._id || department.id} value={department._id}>
                                        <div className="flex justify-between items-center">
                                            <span>{language == 'khmer' ? department.title_kh : department.title_en}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>

                        {/* <button onClick={showCreateDrawer} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['payroll']}`}</button> */}
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

            </Content>

            <ModalMdCenter
                open={open}
                onOk={() => setOpen(false)}
                onCancel={closeDrawer}
                title={
                    actionForm === 'create'
                        ? `${content['create']} ${content['newStart']} ${content['seniorityPayment']}${content['newEnd']}`
                        : `${content['update']} ${content['seniorityPayment']}`
                }
            >
                {actionForm === 'create' ? (
                    ""
                    // <PayrollCreatePage onUserCreated={handleAddCreated} onCancel={closeDrawer} />
                ) : (
                    <SubPayrollFormPage onUserUpdated={handleUpdate} dataId={selectedUserId} onCancel={closeDrawer} />
                )}
            </ModalMdCenter>
        </>
    )
}

export default SubPayrollPage
