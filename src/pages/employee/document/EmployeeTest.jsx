import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createEpmUploadApi } from '../../../services/employeeApi';
import EmployeeNav from '../EmployeeNav';
import { Styles } from '../../../utils/CsStyle';

const DocumentUploader = () => {
    const [fileList, setFileList] = useState([]);
    const { id } = useParams();

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleUpload = async () => {
        const formData = new FormData();

        fileList.forEach(file => {
            formData.append('documents', file.originFileObj);
        });

        try {
            await createEpmUploadApi(id, formData);
            message.success('Documents uploaded successfully!');
            setFileList([]);
        } catch (error) {
            console.error(error);
            message.error('Failed to upload');
        }
    };

    return (
        <>
            <EmployeeNav />
            <Upload
                multiple
                beforeUpload={() => false}
                onChange={handleChange}
                fileList={fileList}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            >
                <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                className="mt-2"
            >
                Upload
            </Button>

            <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                <button type="button" className={Styles.btnCancel}>Cancel</button>
                <button type="submit" className={Styles.btnCreate}>Submit</button>
            </div>
        </>
    );
};

export default DocumentUploader;
