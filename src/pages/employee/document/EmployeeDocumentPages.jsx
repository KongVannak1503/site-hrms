import { Upload, Button, message, Card, Table, Tag, Space, Tooltip, Input } from 'antd';
import { CloudDownloadOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createEpmUploadApi, deleteEpmUploadApi, getEpmUploadApi } from '../../../services/employeeApi';
import EmployeeNav from '../EmployeeNav';
import { Styles } from '../../../utils/CsStyle';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { formatDateTime } from '../../../utils/utils';
import StatusTag from '../../../components/style/StatusTag';
import uploadUrl, { handleDownload } from '../../../services/uploadApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { tableHeaderComponents } from '../../../components/table/tableHeaderComponents';

const EmployeeDocumentPage = () => {
    const { content } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const { id } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    useEffect(() => {
        document.title = `${content['documents']} | USEA`;
        const fetchData = async () => {
            try {
                const response = await getEpmUploadApi(id);

                if (Array.isArray(response)) {
                    setUsers(response);
                    setFilteredData(response);
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

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('title', title);
        fileList.forEach(file => {
            formData.append('documents', file.originFileObj);
        });

        try {
            await createEpmUploadApi(id, formData);
            message.success(content['saveSuccessful']);
            setTitle('')
            setUploadedFiles(fileList.map(file => file.name));
            setFileList([]);

            const response = await getEpmUploadApi(id);

            if (Array.isArray(response)) {
                setUsers(response);
                setFilteredData(response);
            } else {
                console.error('Data is not an array:', response);
                setUsers([]);
                setFilteredData([]);
            }

        } catch (error) {
            console.error(error);
            message.error('Failed to upload');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteEpmUploadApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success(content['deleteSuccessFully']);
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

    const downloadUrl = (filePath) => `${uploadUrl}/${filePath}`;

    const columns = [
        {
            title: content['name'],
            dataIndex: "title",
            key: "title",
            render: (_, text) => <span>{text.title}</span>,
        },

        {
            title: content['extension'],
            dataIndex: "extension",
            key: "extension",
            render: (text) => <span>{text}</span>,
        },
        {
            title: content['size'],
            dataIndex: "size",
            key: "size",
            render: (text) => <span>{text}</span>,
        },

        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => <div>
                <span>{formatDateTime(text)}</span>
                <p>{record.createdBy ? `${content['createdBy']}: ${record.createdBy?.username}` : ''}</p>
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
                    <Tooltip title={content['download']}>
                        <a className={Styles.btnDownload} onClick={() => handleDownload(record.path, record.name)} download target="_blank" rel="noopener noreferrer">
                            <CloudDownloadOutlined />
                        </a>
                    </Tooltip>
                    {ConfirmDeleteButton({
                        onConfirm: () => handleDelete(record._id),
                        tooltip: content['delete'],
                        title: content['confirmDelete'],
                        okText: content['yes'],
                        cancelText: content['no'],
                        description: `${content['areYouSureToDelete']} ${record.title || 'this item'}?`
                    })}
                </Space>
            ),
        },
    ];

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['documents'] }
    ];

    return (
        <>
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <EmployeeNav />
            </div>

            <div style={{
                paddingTop: 56,
                paddingBottom: 100,
                paddingLeft: 20,
                paddingRight: 20,
            }}>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeInfo']}</p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>
                <Card title={<p className='text-default text-sm font-bold'>{content['documents']}</p>} className="shadow">
                    <div className='pb-3'>{`${content['documentName']}`}</div>
                    <div className="grid grid-cols-3">
                        <Input
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mt-3"></div>
                    <Upload
                        multiple
                        beforeUpload={() => false}
                        onChange={handleChange}
                        fileList={fileList}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    >
                        <button className={Styles.btnSecondary} icon={<UploadOutlined />}>Select Files</button>
                    </Upload>
                </Card>
                <hr className="border-0 py-3" />
                <Card title="Documents Uploaded" className="shadow">

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        components={tableHeaderComponents}
                    />
                </Card>
            </div>


            <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                <button onClick={handleUpload}
                    disabled={fileList.length === 0} type="submit" className={Styles.btnCreate}>{content['save']}</button>
            </div>
        </>
    );
};

export default EmployeeDocumentPage;
