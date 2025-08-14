import {
    Button, Card, DatePicker, Form, Input, message, Select, Space, Table, Tooltip, Upload
} from 'antd';
import {
    FileTextOutlined, PaperClipOutlined, CloudDownloadOutlined, FormOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../../contexts/AuthContext';
import { Styles } from '../../../utils/CsStyle';
import EmployeeNav from '../EmployeeNav';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { typeEmployeePositionOptions } from '../../../data/Type';
import { getEpmPositionsApi, createEpmPositionApi, updateEpmPositionApi } from '../../../services/employeeApi';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { handleDownload } from '../../../services/uploadApi';
import { formatDate, formatDateTime } from '../../../utils/utils';

const EmployeePositionPage = () => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { id } = useParams();
    const [fileList, setFileList] = useState([]);
    const [file, setFile] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    useEffect(() => {
        document.title = `${content['position']} | USEA`;
        fetchInitialData();
    }, [id, content]);

    const fetchInitialData = async () => {
        try {
            const response = await getEpmPositionsApi(id);
            setFilteredData(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setEditingRecord(record);

        form.setFieldsValue({
            positionId: record.positionId,
            name: record.name,
            appointedDate: record.joinDate ? moment(record.joinDate) : null,
        });

        const preparedFiles = (record.documents ? [record.documents] : []).map((doc, index) => ({
            uid: index.toString(),
            name: doc.name,
            status: 'done',
            url: `/${doc.path}`,  // Ensure full path or absolute URL
            originFileObj: null,
        }));
        setFileList(preparedFiles); // ✅ Fix here
        setFile(null);
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setIsEditing(false);
        setEditingRecord(null);
    };

    const handleFileChange = ({ file }) => {
        setFile(file); // This captures the file object
    };

    const handleDelete = async (id) => {
        // try {
        //     await deleteEpmPosi(id); // call the API
        //     const updatedUsers = users.filter(role => role._id !== id);
        //     setUsers(updatedUsers);
        //     setFilteredData(updatedUsers);
        //     message.success('Deleted successfully');
        // } catch (error) {
        //     console.error('Delete failed:', error);
        //     message.error('Failed to delete');
        // }
    };


    const handleFinish = async (values) => {
        try {
            const formData = new FormData();

            formData.append('positionId', values.positionId);
            formData.append('name', values.name);
            formData.append('joinDate', values.appointedDate ? values.appointedDate.format('YYYY-MM-DD') : '');

            formData.append('file', file);
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('file', fileList[0].originFileObj);
            }

            // Pass existing documents info if needed
            if (!file && fileList.length > 0) {
                const existingDoc = {
                    name: fileList[0].name,
                    path: fileList[0].url.replace(/^\//, ''),  // remove leading slash if needed
                    extension: fileList[0].name.split('.').pop(),
                };
                formData.append('existingDocumentsJson', JSON.stringify(existingDoc));
            }

            if (isEditing && editingRecord) {
                // Update API call - pass editingRecord._id
                await updateEpmPositionApi(editingRecord._id, formData);
                message.success('Updated successfully!');
            } else {
                // Create new
                formData.append('employeeId', id);
                await createEpmPositionApi(id, formData);
                message.success('Saved successfully!');
            }

            handleCancel();
            fetchInitialData();

        } catch (error) {
            console.error('Save error:', error);
            message.error('Failed to save position');
        }
    };

    const columns = [
        {
            title: "តែងតាំងដោយ",
            dataIndex: "positionId",
            render: (positionId) => {
                const opt = typeEmployeePositionOptions.find(o => o.id === positionId);
                return <span>{opt?.name_kh || '-'}</span>;
            }
        },
        {
            title: "មុខដំណែងបន្ថែម",
            dataIndex: "name",
        },
        {
            title: "កាលបរិច្ឆេទតែងតាំង",
            dataIndex: "joinDate",
            render: (date) => <span>{formatDate(date)}</span>,
        },
        {
            title: content['document'],
            render: (_, record) => <span>{record.documents?.name || '-'}</span>,
        },
        {
            title: content['size'],
            render: (_, record) => <span>{record.documents?.size || '-'}</span>,
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            render: (text, record) => (
                <div>
                    <span>{formatDateTime(text)}</span>
                    <p>{record.createdBy ? `${content['createdBy']}: ${record.createdBy.username}` : ''}</p>
                </div>
            ),
        },
        {
            title: content['action'],
            render: (_, record) => (
                <Space>
                    <Tooltip title={content['download']}>
                        <a
                            className={Styles.btnDownload}
                            onClick={() => handleDownload(record.documents?.path, record.documents?.name)}
                        >
                            <CloudDownloadOutlined />
                        </a>
                    </Tooltip>
                    <Tooltip title={content['edit']}>
                        <button type='button' className={Styles.btnEdit} onClick={() => handleEdit(record)}>
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    {ConfirmDeleteButton({
                        onConfirm: () => handleDelete(record._id),
                        tooltip: content['delete'],
                        title: content['confirmDelete'],
                        okText: content['yes'],
                        cancelText: content['no'],
                        description: `${content['areYouSureToDelete']} ${record.name}?`
                    })}
                </Space>
            ),
        }
    ];

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['position'] }
    ];

    return (
        <div className="flex flex-col">
            <div className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}>
                <EmployeeNav />
            </div>

            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                autoComplete="off"
                style={{ paddingTop: 70, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}
            >
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'>
                        <FileTextOutlined className='mr-2' />{content['employeeInfo']}
                    </p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>

                <Card title={<p className='text-default text-sm font-bold'>{content['documents']}</p>} className="shadow">
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="positionId" label="តែងតាំងដោយ" rules={[{ required: true }]}>
                            <Select className="w-full">
                                {typeEmployeePositionOptions.map(opt => (
                                    <Select.Option key={opt.id} value={opt.id}>
                                        {opt.name_kh}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="name" label="មុខដំណែងបន្ថែម" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="appointedDate" label="កាលបរិច្ឆេទតែងតាំង" rules={[{ required: true }]}>
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </div>
                    {/* <Upload
                        multiple={false}
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={({ file }) => setFileList(file ? [file] : [])}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    >
                        <button type="button" className={`${Styles.btnSecondary} mt-3`}>
                            <PaperClipOutlined /> Select File
                        </button>
                    </Upload> */}

                    <Upload
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        maxCount={1}
                    >
                        <button type="button" className={`${Styles.btnSecondary} mt-3`}>
                            <PaperClipOutlined /> Select File
                        </button>
                    </Upload>
                </Card>

                <hr className="border-0 py-3" />

                <Card title={<p className='text-default text-sm font-bold'>ឯកសារដែលបានបញ្ចូល</p>} className="shadow">
                    <Table
                        className='customTableHeader'
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={false}
                    />
                </Card>

                <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                    style={{ position: 'fixed', bottom: 0, width: '100%', right: 20, zIndex: 20 }}>
                    <Space>
                        {isEditing && (
                            <button type="button" className={Styles.btnCancel} onClick={handleCancel}>
                                {content['cancel']}
                            </button>
                        )}
                        <button type="submit" className={Styles.btnCreate}>
                            {content['save']}
                        </button>
                    </Space>
                </div>
            </Form>
        </div >
    );
};

export default EmployeePositionPage;
