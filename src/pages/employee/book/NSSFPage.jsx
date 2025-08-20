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

const NSSFPage = () => {
    const { content } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const [claimTitle, setClaimTitle] = useState('');
    const [claimType, setClaimType] = useState('');
    const [claimDate, setClaimDate] = useState('');
    const [claimOther, setClaimOther] = useState('');
    const { id } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [editingRowKey, setEditingRowKey] = useState(null);
    const [editedRow, setEditedRow] = useState({});

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    useEffect(() => {
        document.title = `${content['nssf']} | USEA`;
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

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('claimTitle', claimTitle);
        formData.append('claimType', claimType);
        formData.append('claimDate', claimDate);
        formData.append('claimOther', claimOther);
        fileList.forEach(file => {
            formData.append('documents', file.originFileObj);
        });

        try {
            await createEpmNssfApi(id, formData);
            message.success('Documents uploaded successfully!');
            setTitle('')
            setClaimOther('')
            setClaimTitle('')
            setClaimDate('');
            setClaimType('');
            setUploadedFiles(fileList.map(file => file.name));
            setFileList([]);

            const response = await getEpmUploadNssfDocApi(id);

            if (Array.isArray(response)) {
                setFilteredData(response);
            } else {
                console.error('Data is not an array:', response);
                setFilteredData([]);
            }

            const responseUser = await getEpmUploadNssfApi(id);

            if (Array.isArray(responseUser)) {
                setUsers(responseUser);
            } else {
                console.error('Data is not an array:', responseUser);
                setUsers([]);
            }

        } catch (error) {
            console.error(error);
            message.error('Failed to upload');
        }
    };

    const onEdit = (record) => {
        setEditingRowKey(record._id);
        setEditedRow({
            _id: record._id,
            claimTitle: record.claimTitle,
            claimType: record.claimType,
            claimDate: record.claimDate,
            claimOther: record.claimOther,
        });
    };

    const onCancel = () => {
        setEditingRowKey(null);
        setEditedRow({});
    };

    const onSave = async () => {
        try {
            // Call your API to update here
            // await updateEpmNssfApi(editedRow._id, editedRow);


            const updated = users.map(item =>
                item._id === editedRow._id ? editedRow : item
            );
            console.log(updated);
            updateEmpNssfApi(updated);
            // setUsers(updated);
            // setFilteredData(updated);

            // setEditingRowKey(null);
            message.success('Updated successfully');
        } catch (err) {
            console.error(err);
            message.error('Update failed');
        }
    };


    const handleDeleteDoc = async (id) => {
        try {
            await deleteEpmNssfDocApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };
    const handleDelete = async (id) => {
        try {
            await deleteEpmNssfApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

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
                    {ConfirmDeleteButton({
                        onConfirm: () => handleDeleteDoc(record._id),
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
        {
            title: content['action'],
            key: "action",
            render: (_, record) => (
                <Space>
                    {editingRowKey === record._id ? (
                        <>
                            <Tooltip title={content['save']}>
                                <button className={Styles.btnEdit} onClick={onSave}>
                                    <CheckOutlined />
                                </button>
                            </Tooltip>
                            <Tooltip title={content['cancel']}>
                                <button className={`${Styles.btnDelete}`} onClick={onCancel}>
                                    <CloseOutlined />
                                </button>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title={content['edit']}>
                                <button className={Styles.btnEdit} onClick={() => onEdit(record)}>
                                    <FormOutlined />
                                </button>
                            </Tooltip>
                            {ConfirmDeleteButton({
                                onConfirm: () => handleDelete(record._id),
                                tooltip: content['delete'],
                                title: content['confirmDelete'],
                                okText: content['yes'],
                                cancelText: content['no'],
                                description: `${content['areYouSureToDelete']} ${record.claimTitle || 'this item'}?`
                            })}
                        </>
                    )}
                </Space>
            ),
        },
    ];


    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['nssf'] }
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
                <Card title={<p className='text-default text-sm font-bold'>{content['nssf']}</p>} className="shadow">
                    <div className='pb-3'>{`${content['name']} ${content['nssf']}`}</div>
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

                <Card title={<p className='text-default text-sm font-bold'>ប្រវត្តិនៃការ Claim {content['nssf']}</p>} className="shadow">

                    <div className="grid grid-cols-3 gap-4 mb-5">
                        <div>
                            <div className='pb-3'>មូលហេតុ</div>
                            <Input
                                name="title"
                                value={claimTitle}
                                onChange={(e) => setClaimTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className='pb-3'>{content['type']}</div>
                            <Select
                                style={{ width: '100%' }}
                                value={claimType}             // employeeType holds the id like 1, 2, or 3
                                onChange={(value) => setClaimType(value)}
                                optionLabelProp="children"      // <-- this makes the Select show the option's children (name_kh) as the selected label
                            >
                                {typeNssfOptions.map(option => (
                                    <Select.Option key={option.id} value={option.id}>
                                        {option.name_kh}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <p className="mb-3">{content['date']}</p>
                            <DatePicker
                                onChange={(date, dateString) => setClaimDate(dateString)}
                                className="w-full" placeholder='ជ្រើសរើសកាលបរិច្ឆេទ'
                                value={claimDate ? moment(claimDate, 'YYYY-MM-DD') : null} />
                        </div>
                    </div>
                    <p className="my-3">
                        Other
                    </p>
                    <Input.TextArea
                        value={claimOther}
                        onChange={(e) => setClaimOther(e.target.value)}
                        rows={4} />
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


            <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                <button onClick={handleUpload}
                    type="submit" className={Styles.btnCreate}>{content['save']}</button>
            </div>
        </>
    );
};

export default NSSFPage;
