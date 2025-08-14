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

const TabDocument = () => {
    const { content } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const { id } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
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
                </Space>
            ),
        },
    ];


    return (
        <>

            <div style={{
                // paddingTop: 56,
                // paddingBottom: 100,
                // paddingLeft: 20,
                // paddingRight: 20,
            }}>
                <Card title="Documents Uploaded" className="shadow">

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={false}
                    />
                </Card>
            </div>
        </>
    );
};

export default TabDocument;
