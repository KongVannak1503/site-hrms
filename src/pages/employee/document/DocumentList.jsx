import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { getEpmUploadApi } from '../../../services/employeeApi';

const DocumentList = () => {
    const { id } = useParams();
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            const res = await getEpmUploadApi(id);
            setDocs(res);
        };
        fetchDocs();
    }, [id]);

    const downloadUrl = (filePath) => `http://localhost:3000/${filePath}`;

    const columns = [
        {
            title: 'File Name',
            dataIndex: 'name',
        },
        {
            title: 'Size',
            dataIndex: 'size',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <a href={downloadUrl(record.path)} target="_blank" rel="noopener noreferrer">
                    <Button type="link">Download</Button>
                </a>
            ),
        },
    ];

    return <Table rowKey="_id" dataSource={docs} columns={columns} />;
};

export default DocumentList;
