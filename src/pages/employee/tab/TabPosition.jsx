import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import { getEpmPositionsApi } from '../../../services/employeeApi';
import { formatDate, formatDateTime } from '../../../utils/utils';
import { Styles } from '../../../utils/CsStyle';
import { typeEmployeePositionOptions } from '../../../data/Type';
import { Card, Space, Table, Tooltip } from 'antd';
import {
    FileTextOutlined, PaperClipOutlined, CloudDownloadOutlined, FormOutlined
} from '@ant-design/icons';
import { handleDownload } from '../../../services/uploadApi';

const TabPosition = ({ id }) => {
    const { content, language } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
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
            title: content['action'],
            render: (_, record) => (
                <div className="text-center">
                    <Space>
                        <Tooltip title={content['download']}>
                            <a
                                className={Styles.btnDownload}
                                onClick={() => handleDownload(record.documents?.path, record.documents?.name)}
                            >
                                <CloudDownloadOutlined />
                            </a>
                        </Tooltip>
                    </Space>
                </div>
            ),
        }
    ];

    return (
        <div className='overflow-x-auto'>
            <Card title={<p className='text-default text-sm font-bold'>{content['title']}</p>} className="shadow">
                <Table
                    className='customTableHeader'
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    pagination={false}
                />
            </Card>
        </div>
    )
}

export default TabPosition
