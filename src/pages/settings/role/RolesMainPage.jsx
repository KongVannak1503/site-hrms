import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Tooltip } from 'antd';
import {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { Content } from 'antd/es/layout/layout';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Styles } from '../../../utils/CsStyle';
import { useNavigate } from 'react-router-dom';
import { getRolesCountNameApi } from '../../../services/roleApi';
import { useEffect } from 'react';

const initialRoles = [
    { _id: '1', name: 'admin' },
    { _id: '2', name: 'hr' },
    { _id: '2', name: 'upper manager' },
    { _id: '2', name: 'manager' },
    { _id: '3', name: 'employee' },
];

function RolesMainPage() {
    const { isLoading, content } = useAuth();
    const [roles] = useState(initialRoles);
    const [roleCounts, setRoleCounts] = useState({});

    const navigate = useNavigate();


    useEffect(() => {
        const fetchCounts = async () => {
            const counts = {};

            for (const role of initialRoles) {
                try {
                    const data = await getRolesCountNameApi(role.name);
                    counts[role.name] = data.count;
                } catch (err) {
                    console.error(`Failed to count ${role.name}`, err);
                    counts[role.name] = 0;
                }
            }

            setRoleCounts(counts);
        };

        fetchCounts();
    }, []);

    const handleRole = (action) => {
        navigate(`/setting/user/role/${action}`);
    };

    const columns = [
        {
            title: content['name'],
            dataIndex: 'name',
            key: 'name',
            render: text => <span>{text}</span>,
        },
        {
            title: content['count'],
            dataIndex: 'count',
            key: 'count',
            render: (_, text) => (
                <span >{roleCounts[text.name]}</span>
            ),
        },
        {
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {content['action']}
                </span>
            ),
            key: 'actions',
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title={content['edit']}>
                        <button
                            className={Styles.btnEdit}
                            shape="circle"
                            onClick={() => handleRole(record.name)}
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['roles'] }
    ];


    return (
        <div>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['roles']}</p>
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

                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="_id"
                    pagination={false}
                />


            </Content >
        </div >
    );
}

export default RolesMainPage;
