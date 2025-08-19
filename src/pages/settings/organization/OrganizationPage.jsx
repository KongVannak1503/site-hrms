import React, { useState } from 'react'
// import UserCreate from './UserCreate'
import { Breadcrumb, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { FileTextOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useEffect } from 'react';
import OrganizationCreatePage from './OrganizationCreatePage';
import ModalLgCenter from '../../../components/modals/ModalLgCenter';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { Styles } from '../../../utils/CsStyle';
import { formatDateTime } from '../../../utils/utils';
import { deleteOrganizationApi, getOrganizationsApi } from '../../../services/organizationApi';
import OrganizationUpdatePage from './OrganizationUpdatePage';

const OrganizationPage = () => {
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
        { breadcrumbName: content['organizations'] }
    ];

    useEffect(() => {
        document.title = `${content['organizations']} | USEA`;
        const fetchData = async () => {
            try {
                const response = await getOrganizationsApi();
                setUsers(response);
                console.log(response);

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
            await deleteOrganizationApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };


    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['organizations']}</p>
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
                </div>
                {(!users || users.length === 0) ? (
                    <OrganizationCreatePage
                        form={form}
                        onCreated={(newOrg) => {
                            // Add new organization to state
                            setUsers([newOrg, ...users]);
                            setFilteredData([newOrg, ...filteredData]);

                            // Set selected ID so Update page renders
                            setSelectedUserId(newOrg._id);
                        }}
                    />
                ) : (
                    <OrganizationUpdatePage dataId={selectedUserId || users[0]._id} />
                )}

            </Content >
        </div >
    )
}

export default OrganizationPage
