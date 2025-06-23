import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import { FaRegImages } from "react-icons/fa";
import { createEmployeeApi } from '../../services/employeeApi';
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';

const EmployeeCreatePage = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();

    const { Text } = Typography;
    const [fileList, setFileList] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    useEffect(() => {
        form.resetFields();
    }, [content]);

    useEffect(() => {
        // Clean up preview URL to avoid memory leaks
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = ({ fileList: newFileList }) => {
        // Only keep the latest file
        const latestFileList = newFileList.slice(-1);

        setFileList(latestFileList);

        if (latestFileList[0]?.originFileObj) {
            const objectUrl = URL.createObjectURL(latestFileList[0].originFileObj);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    };
    const handleFinish = async (values) => {
        try {
            const { title, description, isActive } = values;
            const formData = {
                title,
                description,
                isActive,
            };

            console.log(values);

            const response = await createEmployeeApi(formData);
            message.success('Created successfully!');

            onUserCreated(response.data);
            form.resetFields();
        } catch (error) {
            console.error('Error creating User:', error);
            message.error('Failed to create User');
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
            <Card
                title="Basic Information"
                className='shadow'
            >
                <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="col-span-1">
                        <div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">{content['logo']}</label>
                            </div>
                            <Upload
                                listType="picture"
                                maxCount={1}
                                accept="image/*"
                                onChange={handleChange}
                                fileList={fileList}
                                beforeUpload={() => false} // Prevent auto upload for demo, handle manually
                            >
                                <div className="border mt-2 relative border-dashed bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer hover:border-blue-500 w-[200px] h-[150px] overflow-hidden flex justify-center items-center">
                                    {previewUrl ? (
                                        <div>
                                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 whitespace-nowrap">
                                                {content['uploadImage']}
                                            </p>
                                            <img
                                                src={previewUrl}
                                                alt="Uploaded"
                                                width={200} height={100}
                                                className="max-w-full max-h-full object-cover"
                                            />

                                        </div>

                                    ) : (
                                        <div>
                                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 whitespace-nowrap">
                                                {content['uploadImage']}
                                            </p>
                                            <FaRegImages style={{ width: '100px', height: '100px', color: '#ccc' }} />
                                        </div>
                                    )}
                                </div>

                            </Upload>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Form.Item
                                    name="employee_id"
                                    label={content['employeeID']}
                                    rules={[{
                                        required: true,
                                        message: `${content['please']}${content['enter']}${content['employeeID']}`
                                            .toLowerCase()
                                            .replace(/^./, str => str.toUpperCase())
                                    }]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="first_name"
                                    label={content['firstName']}
                                    rules={[{
                                        required: true,
                                        message: `${content['please']}${content['enter']}${content['firstName']}`
                                            .toLowerCase()
                                            .replace(/^./, str => str.toUpperCase())
                                    }]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="last_name"
                                    label={content['lastName']}
                                    rules={[{
                                        required: true,
                                        message: `${content['please']}${content['enter']}${content['lastName']}`
                                            .toLowerCase()
                                            .replace(/^./, str => str.toUpperCase())
                                    }]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    name="email"
                                    label={content['email']}
                                    rules={[{
                                        required: true,
                                        message: `${content['please']}${content['enter']}${content['email']}`
                                            .toLowerCase()
                                            .replace(/^./, str => str.toUpperCase())
                                    }]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label={content['phone']}
                                    rules={[{
                                        required: true,
                                        message: `${content['please']}${content['enter']}${content['phone']}`
                                            .toLowerCase()
                                            .replace(/^./, str => str.toUpperCase())
                                    }]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <hr className="border-0 py-3" />
            <Card
                title="Work Flow"
                className='shadow'
            >
                <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        name="height"
                        label={content['height']}
                        rules={[{
                            required: true,
                            message: `${content['please']}${content['enter']}${content['height']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        name="date_of_birth"
                        label={content['dateOfBirth']}
                        rules={[{
                            required: true,
                            message: `${content['please']}${content['enter']}${content['dateOfBirth']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        name="place_of_birth"
                        label={content['placeOfBirth']}
                        rules={[{
                            required: true,
                            message: `${content['please']}${content['enter']}${content['placeOfBirth']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                </div>
                <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        name="id_card_no"
                        label={content['idCardNo']}
                        rules={[{
                            required: true,
                            message: `${content['please']}${content['enter']}${content['idCardNo']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        name="passport_no"
                        label={content['passportNo']}
                        rules={[{
                            required: true,
                            message: `${content['please']}${content['enter']}${content['passportNo']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        name="marital_status"
                        label={content['maritalStatus']}
                        rules={[{
                            required: true,
                            message: `${content['please']}${content['enter']}${content['maritalStatus']}`
                                .toLowerCase()
                                .replace(/^./, str => str.toUpperCase())
                        }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                </div>
                <Form.Item label={content['status']} name="isActive" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Card>

            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </Form >
    );
};

export default EmployeeCreatePage;
