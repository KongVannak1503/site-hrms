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

const TabBook = ({ id }) => {
    const { content } = useAuth();

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
            title: content['EndDate'],
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
                </Space>
            ),
        },
    ];

    return (
        <>
            <div>
                <Card title={<p className='text-default text-sm font-bold'>ប្រកាសចូល</p>}>
                    <Checkbox
                        checked={post}
                    >
                        ប្រកាសចូល
                    </Checkbox>
                </Card>
                {/* Section 1: Health Result */}


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
        </>
    );
};

export default TabBook;
