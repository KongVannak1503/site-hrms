import { Upload, Button, message, Card, Table, Tag, Space, Tooltip, Input, Select, DatePicker } from 'antd';
import { CloudDownloadOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeNav from '../EmployeeNav';
import { Styles } from '../../../utils/CsStyle';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { formatDateTime } from '../../../utils/utils';
import StatusTag from '../../../components/style/StatusTag';
import { handleDownload } from '../../../services/uploadApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { getPositionsApi, getPositionsViewApi } from '../../../services/positionApi';
import { typeLaborLawOptions } from '../../../data/Type';
import { createEpmLaborLawsApi, deleteEpmLaborLawApi, getEpmUploadLaborLawApi } from '../../../services/employeeApi';
import moment from 'moment';
import { tableHeaderComponents } from '../../../components/table/tableHeaderComponents';

const LaborLawPage = () => {
    const { content, language } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const [position, setPosition] = useState('');
    const [employeeType, setEmployeeType] = useState('');
    const [duration, setDuration] = useState('');
    const [positions, setPositions] = useState([]);
    const { id } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    useEffect(() => {
        document.title = `${content['contract']} | USEA`;
        const fetchData = async () => {
            try {
                const resPositions = await getPositionsViewApi();
                setPositions(resPositions);

                const laborLawData = await getEpmUploadLaborLawApi(id);
                if (Array.isArray(laborLawData) && laborLawData.length > 0) {
                    const laborLaw = laborLawData[0]; // assuming single record per employee

                    setTitle(laborLaw.title || '');
                    setPosition(laborLaw.position || '');
                    setEmployeeType(laborLaw.employee_type || '');
                    setDuration(laborLaw.duration ? laborLaw.duration.split('T')[0] : '');
                    setUsers(laborLaw.file || []);
                    setFilteredData(laborLaw.file || []);
                } else {
                    setUsers([]);
                    setFilteredData([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [content, id, language]);

    console.log(language);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('employeeId', id);   // IMPORTANT: include employeeId
        formData.append('title', title);
        formData.append('position', position);
        formData.append('employeeType', employeeType);
        formData.append('duration', duration);

        fileList.forEach(file => {
            formData.append('documents', file.originFileObj);  // Use 'documents' here
        });

        try {
            await createEpmLaborLawsApi(id, formData);
            message.success('Documents uploaded successfully!');
            setFileList([]);

            // Refresh list to show new files
            const response = await getEpmUploadLaborLawApi(id);
            setUsers(Array.isArray(response) ? response : []);
            setFilteredData(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error(error);
            message.error('Failed to upload');
        }
    };


    const handleDelete = async (id) => {
        try {
            await deleteEpmLaborLawApi(id); // call the API
            const updatedUsers = users.filter(role => role._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

    const columns = [
        {
            title: content['name'],
            dataIndex: "name",
            key: "name",
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
        { breadcrumbName: content['laborLaw'] }
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
                paddingTop: 20,
                paddingBottom: 100,
                paddingLeft: 20,
                paddingRight: 20,
            }}>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeInfo']}</p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeInfo']}</p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>
                <Card title={<p className='text-default text-sm font-bold'>{content['laborLaw']}</p>} className="shadow">

                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <div className='pb-3'>{`${content['name']}`}</div>
                            <Input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <p className="mb-3">{content['position']}</p>
                            <Select
                                style={{ width: '100%' }}
                                value={employeeType}             // employeeType holds the id like 1, 2, or 3
                                onChange={(value) => setEmployeeType(value)}
                                optionLabelProp="children"      // <-- this makes the Select show the option's children (name_kh) as the selected label
                            >
                                {typeLaborLawOptions.map(option => (
                                    <Select.Option key={option.id} value={option.id}>
                                        {language == 'khmer' ? option.name_kh : option.name_en}

                                    </Select.Option>
                                ))}
                            </Select>

                        </div>
                        <div>
                            <p className="mb-3">{content['position']}</p>
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => setPosition(value)}
                                value={position}
                            >
                                {positions.map((position) => (
                                    <Select.Option
                                        key={position._id}
                                        value={position._id}
                                        label={language == 'khmer' ? position.title_kh : position.title_en} // ✅ Add label for search
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{language == 'khmer' ? position.title_kh : position.title_en}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <p className="mb-3">{content['duration']}</p>
                            <DatePicker
                                onChange={(date, dateString) => setDuration(dateString)}
                                className="w-full" placeholder=''
                                value={duration ? moment(duration, 'YYYY-MM-DD') : null} />
                        </div>
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
                <Card title={<p className='text-default text-sm font-bold'>{content['docKh']}{content['laborLaw']} {content['docEn']}</p>} className="shadow">

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={false}
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

export default LaborLawPage;
