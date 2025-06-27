import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Switch, message, Select, Card, Upload, DatePicker, Tabs, Button } from 'antd';
import { Typography } from 'antd';
import { useState } from 'react';
import { FaRegImages } from "react-icons/fa";
import { createEmployeeApi } from '../../services/employeeApi';
import { useAuth } from '../../contexts/AuthContext';
import { Styles } from '../../utils/CsStyle';
import { getDepartmentsApi } from '../../services/departmentApi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const EmployeeCreatePage = ({ form, onCancel, onUserCreated }) => {
    const { content } = useAuth();

    const { Text } = Typography;
    const [fileList, setFileList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { TabPane } = Tabs;
    const [file, setFile] = useState(null);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resDepartments = await getDepartmentsApi();
                setDepartments(resDepartments);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content])
    const handleChange = ({ fileList: newFileList }) => {
        const latestFileList = newFileList.slice(-1);
        setFileList(latestFileList);

        const selectedFile = latestFileList[0]?.originFileObj;

        if (selectedFile) {
            setFile(selectedFile); // ← make sure this is called
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null); // ← clear file if none
            setPreviewUrl(null);
        }
    };


    const handleFinish = async (values) => {
        try {
            const formData = new FormData();
            console.log('Preparing to upload file:', file);
            // Flat fields
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('gender', values.gender || '');
            formData.append('height', values.height || '');
            formData.append('date_of_birth', values.date_of_birth);
            formData.append('place_of_birth', values.place_of_birth || '');
            formData.append('nationality', values.nationality || '');
            formData.append('maritalStatus', values.maritalStatus || '');
            formData.append('isActive', values.isActive ?? true);


            formData.append('file', file); // Must match the multer field name
            console.log(file);
            console.log(values);

            // Nested fields (must stringify because FormData only supports strings/files)
            formData.append('present_address', JSON.stringify(values.present_address || {}));
            formData.append('permanent_address', JSON.stringify(values.permanent_address || {}));
            formData.append('family_members', JSON.stringify(values.family_members || []));
            formData.append('emergency_contact', JSON.stringify(values.emergency_contact || []));
            formData.append('staff_relationships', JSON.stringify(values.staff_relationships || []));

            // Submit to API
            const res = await createEmployeeApi(formData);

            // Show success message
            message.success('Created successfully');
            onUserCreated(res.data);
            form.resetFields();

        } catch (error) {
            console.error('Create error:', error);
            message.error(error.response?.data?.message || 'Failed to create');
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
                title="Personal Data"
                className='shadow custom-card'
            >
                <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 flex justify-center">
                        <div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">{content['logo']}</label>
                            </div>
                            <Upload
                                listType="picture"
                                maxCount={1}
                                accept="image/*"
                                onChange={handleChange}
                                beforeUpload={() => false}
                                fileList={fileList}
                                showUploadList={false}
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
                    <div className="md:col-span-2">
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
                                    <Input />
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
                                    <Input />
                                </Form.Item>
                            </div>
                            <div>
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
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="gender"
                                    label={content['gender']}
                                    rules={[{
                                        required: true,
                                        message: `${content['please']}${content['enter']}${content['gender']}`
                                            .toLowerCase()
                                            .replace(/^./, str => str.toUpperCase())
                                    }]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        name="height"
                        label={content['height']}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="date_of_birth"
                        label={content['dateOfBirth']}
                    >
                        <DatePicker className='w-[100%]' />
                    </Form.Item>
                    <Form.Item
                        name="place_of_birth"
                        label={content['placeOfBirth']}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        name="nationality"
                        label={content['nationality']}
                    >
                        <Select

                            placeholder={`-- ${content['select']}${content['nationality']} --`}
                            showSearch
                            optionFilterProp="children"
                        >
                            {departments.map((dept) => (
                                <Select.Option key={dept._id} value={dept._id}>
                                    {dept.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="id_card_no"
                        label={content['idCardNo']}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="passport_no"
                        label={content['passportNo']}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <Tabs
                    defaultActiveKey="present"
                    items={[
                        {
                            label: 'Present Address',
                            key: 'present',
                            children: (
                                <>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <Form.Item
                                            name={['present_address', 'email']}
                                            label={content['email']}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={['present_address', 'phone']}
                                            label={content['phone']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        name={['present_address', 'description']}
                                        label={content['description']}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </>
                            ),
                        },
                        {
                            label: 'Permanent Address',
                            key: 'permanent',
                            children: (
                                <>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <Form.Item
                                            name={['permanent_address', 'email']}
                                            label={content['email']}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={['permanent_address', 'phone']}
                                            label={content['phone']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        name={['permanent_address', 'description']}
                                        label={content['description']}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </>
                            ),
                        },
                    ]}
                />


            </Card>
            <hr className="border-0 py-3" />
            <Card title="Family Member Information" className="shadow">
                <Form.List name="family_members">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="grid items-center grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label={content['name']}
                                        rules={[{ required: true, message: `${content['please']}${content['enter']}${content['name']}` }]}


                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'relationship']}
                                        label={content['relationship']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'position']}
                                        label={content['position']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'phone']}
                                        label={content['phone']}
                                    >
                                        <div className="flex">
                                            <Input />

                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                aria-label="Remove family member"
                                            />
                                        </div>
                                    </Form.Item>

                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Family Member
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>

            <hr className="border-0 py-3" />
            <Card title=" In Case of Emergency Contact" className="shadow">
                <Form.List name="emergency_contact">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="grid items-center grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label={content['name']}
                                        rules={[{ required: true, message: `${content['please']}${content['enter']}${content['name']}` }]}


                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'relationship']}
                                        label={content['relationship']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'position']}
                                        label={content['position']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'phone']}
                                        label={content['phone']}
                                    >
                                        <div className="flex">
                                            <Input />

                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                aria-label="Remove Emergency Contact"
                                            />
                                        </div>
                                    </Form.Item>

                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Emergency Contact
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>

            <hr className="border-0 py-3" />
            <Card title="Relationship With Staff" className="shadow">
                <p className='mb-5'> Do you have any relationship with staff?  if the answer is "yes", give the following information:</p>
                <Form.List name="staff_relationships">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="grid items-center grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label={content['name']}

                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name={[name, 'date_of_birth']}
                                        label={content['dateOfBirth']}
                                    >
                                        <DatePicker className='w-[100%]' />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'position']}
                                        label={content['position']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'relationship']}
                                        label={content['relationship']}
                                    >
                                        <div className="flex">
                                            <Input />

                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                aria-label="Remove Emergency Contact"
                                            />
                                        </div>
                                    </Form.Item>

                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Emergency Contact
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
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
