import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, message, Upload, Typography } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { createOrganizationApi, getOrganizationApi, updateOrganizationApi } from '../../../services/organizationApi';
import uploadUrl from '../../../services/uploadApi';

const OrganizationUpdatePage = ({ dataId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getOrganizationApi(dataId);
                setImageUrl(response.documents?.path);
                form.setFieldsValue({
                    name: response.name,
                    fullname: response.fullname,
                    email: response.email,
                    phone: response.phone,
                    social_media: response.social_media,
                    website_name: response.website_name,
                    description: response.description,
                    isActive: response.isActive,
                });
            } catch (error) {
                message.error(content['failedToLoad']);
            }
        };
        fetchInitialData();
    }, [dataId, content, form, imageUrl]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = ({ fileList: newFileList }) => {
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
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('fullname', values.fullname);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('social_media', values.social_media);
            formData.append('website_name', values.website_name);
            formData.append('description', values.description || '');
            formData.append('isActive', values.isActive);

            // Append uploaded file if any
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('file', fileList[0].originFileObj);
            }

            // Append existing document info if file has URL (no new upload)
            if (fileList.length > 0 && fileList[0].url) {
                const existingDoc = {
                    name: fileList[0].name,
                    path: fileList[0].url.replace(/^\//, ''),
                    extension: fileList[0].name.split('.').pop(),
                };
                formData.append('existingDocumentsJson', JSON.stringify(existingDoc));
            }

            // Call API to update organization
            const response = await updateOrganizationApi(dataId, formData);
            message.success(content['updateSuccessFully']);

            onUserUpdated(response.data);
        } catch (error) {
            console.error('Error updating organization:', error);
            message.error(content['failedToSave']);
        }
    };

    const defaultImage = "https://cdn-icons-png.freepik.com/256/12783/12783710.png?semt=ais_hybrid";
    const mainImage = imageUrl ? uploadUrl + "/" + imageUrl : defaultImage;

    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            initialValues={{ isActive: true }}
        >
            <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-4 gap-10">
                <div className="col-span-1">
                    <label className="text-sm font-semibold text-gray-700">{content['logo']}</label>
                    <Upload
                        listType="picture"
                        maxCount={1}
                        accept="image/*"
                        onChange={handleChange}
                        fileList={fileList}
                        beforeUpload={() => false}
                    >
                        <div className="border mt-2 border-dashed bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer hover:border-blue-500 w-[200px] h-[100px] overflow-hidden flex justify-center items-center">
                            {previewUrl ? (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Uploaded"
                                        width={200}
                                        height={100}
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
                                        src={mainImage}
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
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="fullname"
                            label={content['nameFull']}
                            rules={[{
                                required: true,
                                message: `${content['please']}${content['enter']}${content['nameFull']}`
                                    .toLowerCase()
                                    .replace(/^./, str => str.toUpperCase())
                            }]}
                        >
                            <Input />
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
                            <Input />
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
                            <Input />
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
                            <Input />
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
                            <Input />
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
                        <button type="submit" className={Styles.btnCreate}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default OrganizationUpdatePage;
