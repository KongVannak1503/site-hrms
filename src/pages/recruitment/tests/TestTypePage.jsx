import { Button, Form, Input, message, Modal, Select, Space, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { createTestTypeApi, deleteTestTypeApi, getAllTestTypesApi, updateTestTypeApi } from '../../../services/testTypeService';
import { createQuestionApi, deleteQuestionApi, getQuestionsByTestTypeApi, updateQuestionApi } from '../../../services/questionService';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../../utils/CsStyle';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';

const TestTypePage = () => {
    const { isLoading, content } = useAuth();
    const [testTypes, setTestTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestType, setEditingTestType] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [searchText, setSearchText] = useState('');
    const [filteredTestTypes, setFilteredTestTypes] = useState([]);

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['testType'] }
    ];

    useEffect(() => {
        document.title = `${content['testType']} | USEA`
        fetchTestTypes();
    }, [content]);

    const fetchTestTypes = async () => {
        setLoading(true);
        try {
            const data = await getAllTestTypesApi();
            setTestTypes(data);
            setFilteredTestTypes(data);
        } catch (err) {
            message.error('Failed to fetch test types');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingTestType(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (testType) => {
        setEditingTestType(testType);
        form.setFieldsValue({
            name_kh: testType.name_kh,
            name_en: testType.name_en,
            description: testType.description,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingTestType) {
                await updateTestTypeApi(editingTestType._id, values);
                message.success('Test type updated');
            } else {
                await createTestTypeApi(values);
                message.success('Test type created');
            }
            setIsModalOpen(false);
            fetchTestTypes();
        } catch (err) {
            console.error('Save error:', err);
            message.error('Failed to save test type');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTestTypeApi(id);
            message.success('Test type deleted');
            fetchTestTypes();
        } catch (err) {
            message.error('Failed to delete');
        }
    };

    const normalizeText = (text) => text?.toLowerCase().normalize("NFC").trim() || '';

    const handleSearch = (e) => {
        const value = normalizeText(e.target.value);
        setSearchText(value);

        const filtered = testTypes.filter(item =>
            normalizeText(item.name_kh).includes(value) ||
            normalizeText(item.name_en).includes(value) ||
            normalizeText(item.description).includes(value)
        );

        setFilteredTestTypes(filtered);
    };


    const columns = [
        { title: `${content['nameKh']}`, dataIndex: 'name_kh' },
        { title: `${content['nameEn']}`, dataIndex: 'name_en' },
        { title: content['description'], dataIndex: 'description' },
        {
            title: content['action'],
            render: (_, record) => (
                <Space>
                    <Tooltip title={content['edit']}>
                        <button className={Styles.btnEdit} onClick={() => openEditModal(record)}>
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
            )
        }
    ];

    if (isLoading) return <FullScreenLoader />;

    return (
        <div>
            <div className="flex justify-between">
                <h1 className='text-xl font-extrabold text-[#002060]'>
                    ព័ត៌មាន{content['testType']}
                </h1>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>
            <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
                <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
                    <h5 className='text-lg font-semibold'>{content['testType']}</h5>
                    <div className='flex gap-3 mt-2 sm:mt-0'>
                        <Input
                            placeholder={content['searchAction']}
                            allowClear
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <button onClick={openCreateModal} className={Styles.btnCreate}>
                            <PlusOutlined /> {`${content['create']} ${content['testType']}`}
                        </button>
                    </div>
                </div>

                <Table
                    className='custom-pagination custom-checkbox-table'
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    dataSource={filteredTestTypes}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} ${content['of']} ${total} ${content['items']}`,
                        locale: {
                            items_per_page: content['page'],
                        },
                        onChange: (page, pageSize) => {
                            setPagination({ ...pagination, current: page, pageSize });
                        }
                    }}
                />

                <Modal
                    title={editingTestType ? 'Edit Test Type' : 'Create Test Type'}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={handleSave}
                    okText="Save"
                    maskClosable={false}
                >
                    <Form form={form} layout="vertical" name="testTypeForm">
                        <Form.Item name="name_kh" label={content['nameKh']} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="name_en" label={content['nameEn']} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label={content['description']}>
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </Form>
                </Modal>

            </Content>
        </div>
    );
};

export default TestTypePage;
