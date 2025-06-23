import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload } from 'antd';
import { Styles } from '../../../components/utils/CsStyle';
import { useAuth } from '../../../components/contexts/AuthContext';
import { Typography } from 'antd';
import { createOrganizationApi } from '../../../apis/organizationApi';
import { useState } from 'react';


const OrganizationCreatePage = ({ form, onCancel, onUserCreated }) => {
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

            const response = await createOrganizationApi(formData);
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
                            <div className="border mt-2 border-dashed bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer hover:border-blue-500 w-[200px] h-[100px] overflow-hidden flex justify-center items-center">
                                {previewUrl ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrl}
                                            alt="Uploaded"
                                            width={200} height={100}
                                            className="max-w-full max-h-full object-cover"
                                        />
                                        <p className="absolute bottom-4 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 whitespace-nowrap">
                                            {content['uploadImage']}
                                        </p>
                                    </div>

                                ) : (
                                    <div className="relative">
                                        <img
                                            width={100}
                                            src="https://cdn-icons-png.freepik.com/256/12783/12783710.png?semt=ais_hybrid"
                                            alt="Placeholder Icon"
                                        />
                                        <p className="absolute bottom-2 right-[-40px] bg-white border border-gray-400 rounded shadow-sm py-1 px-2 whitespace-nowrap">
                                            {content['uploadImage']}
                                        </p>
                                    </div>
                                )}
                            </div>

                        </Upload>
                    </div>
                </div>
                <div className="md:col-span-3">
                    <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input size="large" />
                        </Form.Item>
                    </div>
                    <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="website_name"
                            label={content['website']}
                            rules={[{
                                required: true,
                                message: `${content['please']}${content['enter']}${content['website']}`
                                    .toLowerCase()
                                    .replace(/^./, str => str.toUpperCase())
                            }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item
                            name="social_media"
                            label={content['socialMedia']}
                            rules={[{
                                required: true,
                                message: `${content['please']}${content['enter']}${content['socialMedia']}`
                                    .toLowerCase()
                                    .replace(/^./, str => str.toUpperCase())
                            }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="description"
                        label={content['description']}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label={content['status']} name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <div className="text-end mt-3">
                        <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                            Cancel
                        </button>
                        <button type="submit" className={Styles.btnCreate} >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </Form >
    );
};

export default OrganizationCreatePage;
