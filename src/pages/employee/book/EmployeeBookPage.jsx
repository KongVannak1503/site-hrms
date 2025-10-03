import {
    Upload, Button, message, Card, Table, Space, Tooltip, Input,
    Checkbox
} from 'antd';
import {
    CloudDownloadOutlined, FileTextOutlined, UploadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeNav from '../EmployeeNav';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { formatDate, formatDateTime } from '../../../utils/utils';
import StatusTag from '../../../components/style/StatusTag';
import { handleDownload } from '../../../services/uploadApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { createEpmBookApi, deleteEpmBodyBookApi, deleteEpmBookApi, deleteEpmHealthBookApi, getEmployeeApi, getEpmBodyBooksApi, getEpmBooksApi, getEpmHealthBooksApi } from '../../../services/employeeApi';
import { DatePicker } from 'antd';
import moment from 'moment';
import { tableHeaderComponents } from '../../../components/table/tableHeaderComponents';

const EmployeeBookPage = () => {
    const { content } = useAuth();
    const { id } = useParams();

    // File and title states for all 3 sections
    const [post, setPost] = useState(false);

    const [healthFiles, setHealthFiles] = useState([]);
    const [bodyFiles, setBodyFiles] = useState([]);
    const [bookFiles, setBookFiles] = useState([]);

    const [healthTitle, setHealthTitle] = useState('');
    const [bodyTitle, setBodyTitle] = useState('');
    const [bookTitle, setBookTitle] = useState('');

    const [healthDate, setHealthDate] = useState(null);
    const [bodyDate, setBodyDate] = useState(null);
    const [bookDate, setBookDate] = useState(null);
    const [bookEndDate, setBookEndDate] = useState(null);

    const [empBooks, setEmpBooks] = useState([]);
    const [empHealthBooks, setEmpHealthBooks] = useState([]);
    const [empBodyBooks, setEmpBodyBooks] = useState([]);

    // Fetch uploaded documents
    useEffect(() => {
        document.title = `${content['employeeBook']} | USEA`;
        const fetchData = async () => {
            try {
                const resBooks = await getEpmBooksApi(id);
                if (Array.isArray(resBooks)) {
                    setEmpBooks(resBooks);
                } else {
                    setEmpBooks([]);
                }

                const resHealthBooks = await getEpmHealthBooksApi(id);
                if (Array.isArray(resHealthBooks)) {
                    setEmpHealthBooks(resHealthBooks);
                } else {
                    setEmpHealthBooks([]);
                }

                const resBodyBooks = await getEpmBodyBooksApi(id);
                if (Array.isArray(resBodyBooks)) {
                    setEmpBodyBooks(resBodyBooks);
                } else {
                    setEmpBodyBooks([]);
                }

                const res = await getEmployeeApi(id);
                setPost(res?.post || false);

            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
        fetchData();
    }, [content, id]);

    // Upload handler
    const handleUpload = async () => {
        const formData = new FormData();

        formData.append('healthTitle', healthTitle);
        formData.append('healthDate', healthDate || '');
        healthFiles.forEach(file => {
            formData.append('healthFiles', file.originFileObj);
        });

        formData.append('bodyTitle', bodyTitle);
        formData.append('bodyDate', bodyDate || '');
        bodyFiles.forEach(file => {
            formData.append('bodyFiles', file.originFileObj);
        });

        formData.append('bookTitle', bookTitle);
        formData.append('bookDate', bookDate || '');
        formData.append('bookEndDate', bookEndDate || '');
        bookFiles.forEach(file => {
            formData.append('bookFiles', file.originFileObj);
        });

        formData.append('post', post.toString());
        try {
            await createEpmBookApi(id, formData);

            message.success(content['saveSuccessful']);
            setHealthFiles([]);
            setBodyFiles([]);
            setBookFiles([]);
            setHealthTitle('');
            setBodyTitle('');
            setBookTitle('');
            setHealthDate(null);
            setBodyDate(null);
            setBookDate(null);
            setBookEndDate(null);

            await getEpmBooksApi(id);
            const resBooks = await getEpmBooksApi(id);
            if (Array.isArray(resBooks)) {
                setEmpBooks(resBooks);
            } else {
                setEmpBooks([]);
            }

            const resHealthBooks = await getEpmHealthBooksApi(id);
            if (Array.isArray(resHealthBooks)) {
                setEmpHealthBooks(resHealthBooks);
            } else {
                setEmpHealthBooks([]);
            }

            const resBodyBooks = await getEpmBodyBooksApi(id);
            if (Array.isArray(resBodyBooks)) {
                setEmpBodyBooks(resBodyBooks);
            } else {
                setEmpBodyBooks([]);
            }
        } catch (error) {
            console.error('Upload error:', error);
            message.error(content['failedToSave']);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await deleteEpmBookApi(fileId);
            const updatedUsers = empBooks.filter(item => item._id !== fileId);
            setEmpBooks(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };
    const handleHealthDelete = async (fileId) => {
        try {
            await deleteEpmHealthBookApi(fileId);
            const updatedUsers = empHealthBooks.filter(item => item._id !== fileId);
            setEmpHealthBooks(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };
    const handleBodyDelete = async (fileId) => {
        try {
            await deleteEpmBodyBookApi(fileId);
            const updatedUsers = empBodyBooks.filter(item => item._id !== fileId);
            setEmpBodyBooks(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

    const columns = [
        {
            title: content['name'],
            dataIndex: "title",
            key: "title",
            render: (_, text) => <span>{text.title}</span>,
        },
        {
            title: content['size'],
            dataIndex: "size",
            key: "size",
        },
        {
            title: "កាលបរិច្ឆេទចាប់ផ្ដើម",
            dataIndex: "start_date",
            key: "start_date",
            render: (text, record) => <div>
                <span>{record.start_date ? formatDate(record.start_date) : null}</span>
            </div>,
        },
        {
            title: "កាលបរិច្ឆេទបញ្ចប់",
            dataIndex: "end_date",
            key: "end_date",
            render: (text, record) => <div>
                <span>{record.end_date ? formatDate(record.end_date) : null}</span>
            </div>,
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => (
                <div>
                    <span>{formatDateTime(text)}</span>
                    <p>{record.createdBy ? `${content['createdBy']}: ${record.createdBy.username}` : ''}</p>
                </div>
            ),
        },
        {
            title: content['action'],
            key: "action",
            render: (_, record) => (
                <Space size="middle" className="flex justify-center">
                    <Tooltip title={content['download']}>
                        <a className={Styles.btnDownload}
                            onClick={() => handleDownload(record.path, record.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
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

    const columnsHealth = [
        {
            title: content['name'],
            dataIndex: "title",
            key: "title",
            render: (_, text) => <span>{text.title}</span>,
        },
        {
            title: content['size'],
            dataIndex: "size",
            key: "size",
        },
        {
            title: "កាលបរិច្ឆេទ",
            dataIndex: "start_date",
            key: "start_date",
            render: (text, record) => <div>
                <span>{record.start_date ? formatDate(record.start_date) : null}</span>
            </div>,
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => (
                <div>
                    <span>{formatDateTime(text)}</span>
                    <p>{record.createdBy ? `${content['createdBy']}: ${record.createdBy.username}` : ''}</p>
                </div>
            ),
        },
        {
            title: content['action'],
            key: "action",
            render: (_, record) => (
                <Space size="middle" className="flex justify-center">
                    <Tooltip title={content['download']}>
                        <a className={Styles.btnDownload}
                            onClick={() => handleDownload(record.path, record.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <CloudDownloadOutlined />
                        </a>
                    </Tooltip>
                    {ConfirmDeleteButton({
                        onConfirm: () => handleHealthDelete(record._id),
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

    const columnsBody = [
        {
            title: content['name'],
            dataIndex: "title",
            key: "title",
            render: (_, text) => <span>{text.title}</span>,
        },
        {
            title: content['size'],
            dataIndex: "size",
            key: "size",
        },
        {
            title: "កាលបរិច្ឆេទ",
            dataIndex: "start_date",
            key: "start_date",
            render: (text, record) => <div>
                <span>{record.start_date ? formatDate(record.start_date) : null}</span>
            </div>,
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => (
                <div>
                    <span>{formatDateTime(text)}</span>
                    <p>{record.createdBy ? `${content['createdBy']}: ${record.createdBy.username}` : ''}</p>
                </div>
            ),
        },
        {
            title: content['action'],
            key: "action",
            render: (_, record) => (
                <Space size="middle" className="flex justify-center">
                    <Tooltip title={content['download']}>
                        <a className={Styles.btnDownload}
                            onClick={() => handleDownload(record.path, record.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <CloudDownloadOutlined />
                        </a>
                    </Tooltip>
                    {ConfirmDeleteButton({
                        onConfirm: () => handleBodyDelete(record._id),
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
        { breadcrumbName: content['employeeBook'] }
    ];

    return (
        <>
            <div className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}>
                <EmployeeNav />
            </div>
            <div className="mb-3 flex justify-between">
                <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeBook']}</p>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>
            <div style={{ paddingTop: 20, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'>
                        <FileTextOutlined className='mr-2' />
                        {content['employeeInfo']}
                    </p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>
                <Card title={<p className='text-default text-sm font-bold'>ប្រកាសចូល</p>}>
                    <Checkbox
                        checked={post}
                        onChange={(e) => setPost(e.target.checked)}
                    >
                        ប្រកាសចូល
                    </Checkbox>
                </Card>
                {/* Section 1: Health Result */}
                <hr className="border-0 py-3" />
                <Card title={<p className='text-default text-sm font-bold'>លទ្ធផលពិនិត្យសុខភាព</p>} className="shadow">
                    <div className="grid grid-cols-2 gap-4">
                        <div >
                            <p className='mb-3'>ចំណងជើងឯកសារ</p>
                            <Input value={healthTitle} onChange={(e) => setHealthTitle(e.target.value)} />
                        </div>
                        <div>
                            <p className='mb-3'>កាលបរិច្ឆេទពិនិត្យ</p>
                            <DatePicker
                                className="mb-3"
                                style={{ width: '100%' }}
                                value={healthDate ? moment(healthDate, 'YYYY-MM-DD') : null}
                                onChange={(date, dateString) => setHealthDate(dateString)}
                                placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                            />
                        </div>
                    </div>
                    <div className="mt-3" />
                    <Upload
                        multiple
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setHealthFiles(fileList)}
                        fileList={healthFiles}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    >
                        <button className={Styles.btnSecondary} icon={<UploadOutlined />}>ជ្រើសរើសឯកសារ</button>
                    </Upload>
                </Card>

                <hr className="border-0 py-3" />
                <Card title={<p className='text-default text-sm font-bold'>ឯកសារសុខភាពដែលបានបញ្ចូល</p>} className="shadow">
                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columnsHealth}
                        dataSource={empHealthBooks}
                        rowKey="_id"
                        pagination={false}
                        components={tableHeaderComponents}
                    />
                </Card>

                {/* Section 2: Body Check Certificate */}
                <hr className="border-0 py-3" />
                <Card title={<p className='text-default text-sm font-bold'>វិញ្ញាបនបត្រពិនិត្យកាយសម្បទា</p>} className="shadow">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-3">ចំណងជើងឯកសារ</p>
                            <Input value={bodyTitle} onChange={(e) => setBodyTitle(e.target.value)} className="mb-2" />
                        </div>
                        <div>
                            <p className="mb-3">កាលបរិច្ឆេទពិនិត្យ</p>
                            <DatePicker
                                className="mb-3"
                                style={{ width: '100%' }}
                                value={bodyDate ? moment(bodyDate, 'YYYY-MM-DD') : null}
                                onChange={(date, dateString) => setBodyDate(dateString)}
                                placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                            />
                        </div>
                    </div>
                    <div className="mt-3" />
                    <Upload
                        multiple
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setBodyFiles(fileList)}
                        fileList={bodyFiles}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    >
                        <button className={Styles.btnSecondary} icon={<UploadOutlined />}>ជ្រើសរើសឯកសារ</button>
                    </Upload>
                </Card>
                <hr className="border-0 py-3" />
                <Card title={<p className='text-default text-sm font-bold'>ឯកសារវិញ្ញាបនបត្រពិនិត្យកាយសម្បទាដែលបានបញ្ចូល</p>} className="shadow">
                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columnsBody}
                        dataSource={empBodyBooks}
                        rowKey="_id"
                        pagination={false}
                        components={tableHeaderComponents}
                    />
                </Card>
                {/* Section 3: Work Record Book */}
                <hr className="border-0 py-3" />
                <Card title={<p className='text-default text-sm font-bold'>សៀវភៅបណ្ណការងារ</p>} className="shadow">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="mb-3">
                                លិខិតឆ្លងដែន/Visa
                            </p>
                            <Input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} className="mb-2" />
                        </div>
                        <div>
                            <p className="mb-3">
                                កាលបរិច្ឆេទចាប់ផ្តើម
                            </p>
                            <DatePicker
                                className="mb-3"
                                style={{ width: '100%' }}
                                value={bookDate ? moment(bookDate, 'YYYY-MM-DD') : null}
                                onChange={(date, dateString) => setBookDate(dateString)}
                                placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                            />
                        </div>
                        <div>
                            <p className="mb-3">
                                កាលបរិច្ឆេទបញ្ចប់
                            </p>
                            <DatePicker
                                className="mb-3"
                                style={{ width: '100%' }}
                                value={bookEndDate ? moment(bookEndDate, 'YYYY-MM-DD') : null}
                                onChange={(date, dateString) => setBookEndDate(dateString)}
                                placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                            />
                        </div>
                    </div>
                    <div className="mt-3" />
                    <Upload
                        multiple
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setBookFiles(fileList)}
                        fileList={bookFiles}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    >
                        <button className={Styles.btnSecondary} icon={<UploadOutlined />}>ជ្រើសរើសឯកសារ</button>
                    </Upload>
                </Card>
                <hr className="border-0 py-3" />
                <Card title={<p className='text-default text-sm font-bold'>ឯកសារសៀវភៅបណ្ណការងារដែលបានបញ្ចូល</p>} className="shadow">
                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={empBooks}
                        rowKey="_id"
                        pagination={false}
                        components={tableHeaderComponents}
                    />
                </Card>
            </div>

            <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                <button
                    onClick={handleUpload}
                    // disabled={
                    //     healthFiles.length === 0 &&
                    //     bodyFiles.length === 0 &&
                    //     bookFiles.length === 0
                    // }
                    type="submit"
                    className={Styles.btnCreate}
                >
                    {content['save']}
                </button>
            </div>
        </>
    );
};

export default EmployeeBookPage;
