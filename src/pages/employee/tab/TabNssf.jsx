import { Upload, Button, message, Card, Table, Tag, Space, Tooltip, Input, DatePicker, Select } from 'antd';
import { CheckOutlined, CloseOutlined, CloudDownloadOutlined, FileTextOutlined, FormOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createEpmNssfApi, createEpmUploadApi, deleteEpmNssfApi, deleteEpmNssfDocApi, deleteEpmUploadApi, getEpmUploadApi, getEpmUploadNssfApi, getEpmUploadNssfDocApi, updateEmpNssfApi } from '../../../services/employeeApi';
import EmployeeNav from '../EmployeeNav';
import { Styles } from '../../../utils/CsStyle';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { formatDateTime } from '../../../utils/utils';
import StatusTag from '../../../components/style/StatusTag';
import uploadUrl, { handleDownload } from '../../../services/uploadApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { typeNssfOptions } from '../../../data/Type';
import moment from 'moment';
import { tableHeaderComponents } from '../../../components/table/tableHeaderComponents';

const TabNssf = ({ id }) => {
    const { content } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const [claimTitle, setClaimTitle] = useState('');
    const [claimType, setClaimType] = useState('');
    const [claimDate, setClaimDate] = useState('');
    const [claimOther, setClaimOther] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [editingRowKey, setEditingRowKey] = useState(null);
    const [editedRow, setEditedRow] = useState({});

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    useEffect(() => {
        // document.title = `${content['nssf']} | USEA`;
        const fetchData = async () => {
            try {
                const response = await getEpmUploadNssfDocApi(id);

                if (Array.isArray(response)) {
                    setFilteredData(response);
                } else {
                    console.error('Data is not an array:', response);
                    setFilteredData([]);
                }

                const resNssf = await getEpmUploadNssfApi(id);

                if (Array.isArray(resNssf)) {
                    setUsers(resNssf);
                } else {
                    console.error('Data is not an array:', resNssf);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [content]);

    const columnsDoc = [
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
                </Space>
            ),
        },
    ];

    const getNssfTypeName = (id) => {
        const type = typeNssfOptions.find(item => item.id === id);
        return type ? type.name_kh : '';
    };

    const columns = [
        {
            title: content['name'],
            dataIndex: "claimTitle",
            key: "claimTitle",
            render: (text, record) =>
                editingRowKey === record._id ? (
                    <Input
                        value={editedRow.claimTitle}
                        onChange={(e) =>
                            setEditedRow({ ...editedRow, claimTitle: e.target.value })
                        }
                    />
                ) : (
                    <span>{text}</span>
                ),
        },
        {
            title: content['type'],
            dataIndex: "claimType",
            key: "claimType",
            render: (text, record) =>
                editingRowKey === record._id ? (
                    <Select
                        value={editedRow.claimType}
                        onChange={(value) =>
                            setEditedRow({ ...editedRow, claimType: value })
                        }
                        style={{ width: '100%' }}
                    >
                        {typeNssfOptions.map(option => (
                            <Select.Option key={option.id} value={option.id}>
                                {option.name_kh}
                            </Select.Option>
                        ))}
                    </Select>
                ) : (
                    <span>{getNssfTypeName(text)}</span>
                ),
        },
        {
            title: content['date'],
            dataIndex: "claimDate",
            key: "claimDate",
            render: (text, record) =>
                editingRowKey === record._id ? (
                    <DatePicker
                        value={moment(editedRow.claimDate)}
                        onChange={(date, dateString) =>
                            setEditedRow({ ...editedRow, claimDate: dateString })
                        }
                        className="w-full"
                    />
                ) : (
                    <span>{formatDateTime(text)}</span>
                ),
        },
        {
            title: content['createdAt'],
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => (
                <div>
                    <span>{formatDateTime(text)}</span>
                    <p>{record.createdBy ? `${content['createdBy']}: ${record.createdBy?.username}` : ''}</p>
                </div>
            ),
        },
        {
            title: "ផ្សេងៗ",
            dataIndex: "claimOther",
            key: "claimOther",
            render: (text, record) =>
                editingRowKey === record._id ? (
                    <Input.TextArea
                        value={editedRow.claimOther}
                        onChange={(e) =>
                            setEditedRow({ ...editedRow, claimOther: e.target.value })
                        }
                        autoSize={{ minRows: 1, maxRows: 5 }}
                    />
                ) : (
                    <span>{text}</span>
                ),
        },
    ];


    return (
        <>
            <div >
                <Card title={<p className='text-default text-sm font-bold'>ឯកសារ {content['nssf']}</p>} className="shadow">

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columnsDoc}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={false}
                        components={tableHeaderComponents}
                    />
                </Card>
                <hr className="border-0 py-3" />

                <Card title={<p className='text-default text-sm font-bold'>ឯកសារប្រវត្តិនៃការ Claim  {content['nssf']}</p>} className="shadow">

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={users}
                        rowKey="_id"
                        pagination={false}
                        components={tableHeaderComponents}
                    />
                </Card>
            </div>
        </>
    );
};

export default TabNssf;
