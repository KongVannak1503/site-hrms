import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload, Button } from 'antd';
import { Typography } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import { createEmployeeDocumentApi } from '../../../services/employeeDocumentApi';
import { Styles } from '../../../utils/CsStyle';
import { getEmployeesApi } from '../../../services/employeeApi';
import { useState } from 'react';

const EmployeeDocumentCreatePage = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList }) => setFileList(fileList);

    const { Text } = Typography;

    useEffect(() => {

        form.resetFields();
        const fetchData = async () => {
            try {
                const resEmployees = await getEmployeesApi();
                setEmployees(resEmployees);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);


    const handleFinish = async (values) => {
        try {
            const formData = new FormData();

            // Append normal fields
            formData.append('name', values.name);
            formData.append('employeeId', values.employeeId);

            // Append all selected files using the key "files" (must match backend multer field)
            if (fileList && fileList.length > 0) {
                fileList.forEach(file => {
                    if (file.originFileObj) {
                        formData.append('files', file.originFileObj);
                    }
                });
            }

            // Call your API
            const response = await createEmployeeDocumentApi(formData);

            message.success('Created successfully!');
            onUserCreated(response.data);

            form.resetFields();
            setFileList([]); // clear upload component

        } catch (error) {
            console.error('Error creating:', error);
            message.error('Failed to create');
        }
    };




    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            initialValues={{
                isActive: true
            }}
        >
            <Form.Item
                name="name"
                label={content['name']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['name']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="employeeId"
                label={content['employee']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['select']}${content['name']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {employees.map((employee) => (
                        <Select.Option key={employee._id || employee.id} value={employee._id}>
                            {`${employee.last_name_kh} ${employee.first_name_kh} `}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Upload
                name="files"
                beforeUpload={() => false} // prevents automatic upload
                multiple
                onChange={handleChange}
                showUploadList={{ showRemoveIcon: true }}
            >
                <Button type="dashed">Click to Upload</Button>
            </Upload>
            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </Form>
    );
};

export default EmployeeDocumentCreatePage;
