import { Upload, Button, message, Card, Table, Tag, Space, Tooltip, Input, Select, DatePicker } from 'antd';
import { CloudDownloadOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeNav from '../EmployeeNav';
import { Styles } from '../../../utils/CsStyle';
import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { formatDate, formatDateTime } from '../../../utils/utils';
import StatusTag from '../../../components/style/StatusTag';
import { handleDownload } from '../../../services/uploadApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { getPositionsApi, getPositionsViewApi } from '../../../services/positionApi';
import { typeEmployeeOptions, typeLaborLawOptions } from '../../../data/Type';
import { createEpmLaborLawsApi, deleteEpmLaborLawApi, getEpmUploadLaborLawApi, getEpmUploadLaborLawViewApi } from '../../../services/employeeApi';
import moment from 'moment';
import { tableHeaderComponents } from '../../../components/table/tableHeaderComponents';

const TabLaborLaw = ({ id }) => {
    const { content, language } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [title, setTitle] = useState('');
    const [position, setPosition] = useState('');
    const [employeeType, setEmployeeType] = useState('');
    const [duration, setDuration] = useState('');
    const [positions, setPositions] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPositions = await getPositionsViewApi();
                setPositions(resPositions);

                const laborLawData = await getEpmUploadLaborLawViewApi(id);
                console.log(laborLawData);

                if (Array.isArray(laborLawData) && laborLawData.length > 0) {
                    const laborLaw = laborLawData[0];

                    setTitle(laborLaw?.title || '');
                    // pick the right field instead of whole object
                    setPosition(language == 'khmer' ? laborLaw?.position?.title_kh : laborLaw?.position?.title_en || '');
                    setEmployeeType(laborLaw?.employee_type || '');
                    setDuration(laborLaw?.duration ? laborLaw?.duration.split('T')[0] : '');
                    setUsers(laborLaw?.file || []);
                    setFilteredData(laborLaw?.file || []);
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
                </Space>
            ),
        },
    ];

    return (
        <>
            <div >
                <Card title={<p className='text-default text-sm font-bold'>{content['laborLaw']}</p>} className="shadow">
                    <div className='grid grid-cols-2 gap-3'>
                        <p className='text-gray-500'>{content['fullName']}</p>
                        <p>{title}</p>
                        <p className='text-gray-500'>{content['jobType']}</p>
                        <p>
                            {
                                typeEmployeeOptions.find(opt => opt.id === employeeType)?.[
                                language === "khmer" ? "name_kh" : "name_en"
                                ] || ""
                            }
                        </p>
                        <p className='text-gray-500'>{content['position']}</p>
                        <p>{position}</p>

                        <p className='text-gray-500'>{content['date']}</p>
                        <p>{formatDate(duration)}</p>


                    </div>

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
        </>
    );
};

export default TabLaborLaw;
