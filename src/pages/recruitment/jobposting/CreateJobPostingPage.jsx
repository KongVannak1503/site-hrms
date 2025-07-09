import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Radio, Select, Switch } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getPositionsByDepartmentApi } from '../../../services/positionApi';
import { getJobTypesApi } from '../../../services/jobType';
import { createJobPostingApi } from '../../../services/jobPosting';

const { Option } = Select;

const CreateJobPostingPage = () => {
  const { isLoading, content } = useAuth();
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  const breadcrumbItems = [
      { breadcrumbName: content['home'], path: '/' },
      { breadcrumbName: content['jobPosting'], path: '/job-postings' },
      { breadcrumbName: content['createJobPosting'] },
  ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, typeRes] = await Promise.all([
                    getDepartmentsApi(),
                    getJobTypesApi(),
                ]);

                setDepartments(deptRes);
                setJobTypes(typeRes);
            } catch (err) {
                message.error('Failed to load form data');
            }
        };

        fetchData();
    }, []);

    // Fetch positions when department changes
    useEffect(() => {
        const loadPositions = async () => {
            try {
                if (selectedDepartment) {
                    const res = await getPositionsByDepartmentApi(selectedDepartment);
                    setPositions(res);
                } else {
                    setPositions([]);
                }
            } catch (err) {
                message.error('Failed to load positions');
            }
        };

        loadPositions();
    }, [selectedDepartment]);
  
    const onFinish = async (values) => {
        try {
            const formData = {
                ...values,
                responsibilities,
                requirements,
                open_date: values.open_date?.toISOString(),
                close_date: values.close_date?.toISOString(),
            };

            await createJobPostingApi(formData); // ✅ Create API call here

            message.success('Job posting created successfully!');
            navigate('/job-postings'); // ✅ Redirect after success
        } catch (error) {
            console.error('Error creating job posting:', error);
            message.error('Failed to create job posting. Please try again.');
        }
    };

    const handleCancel = () => {
            navigate('/job-postings');
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }
  
    return (
        <div>
            <div className="flex justify-between">
                <h1 className='text-xl font-extrabold text-[#17a2b8]'>
                    ព័ត៌មាន{content['jobPosting']}
                </h1>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>

        <div className='mt-4'>
            <Card title="Create Job Posting">
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    label="Job Title"
                    name="job_title"
                    rules={[{ required: true, message: 'Please enter job title' }]}
                    className="md:col-span-2"
                    >
                    <Input placeholder="e.g. Senior Software Engineer" />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="department"
                        rules={[{ required: true, message: 'Please select department' }]}
                    >
                        <Select
                            placeholder="Select Department"
                            onChange={(value) => setSelectedDepartment(value)}
                        >
                            {departments.map((dept) => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[{ required: true, message: 'Please select position' }]}
                    >
                        <Select placeholder="Select Position">
                            {positions.map((pos) => (
                                <Option key={pos._id} value={pos._id}>
                                    {pos.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Quantity Available"
                        name="quantity_available"
                        rules={[{ required: true, message: 'Please enter quantity' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Job Type"
                        name="job_type"
                        rules={[{ required: true, message: 'Please select job type' }]}
                    >
                        <Select placeholder="Select Job Type">
                            {jobTypes.map((type) => (
                                <Option key={type._id} value={type._id}>
                                    {type.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Responsibilities"
                        name="responsibilities"
                        rules={[{ required: true, message: 'Please enter responsibilities' }]}
                    >
                        <ReactQuill theme="snow" value={responsibilities} onChange={(value) => {
                            setResponsibilities(value);
                            form.setFieldsValue({ responsibilities: value });
                        }} />
                    </Form.Item>

                    <Form.Item
                        label="Requirements"
                        name="requirements"
                        rules={[{ required: true, message: 'Please enter requirements' }]}
                    >
                        <ReactQuill theme="snow" value={requirements} onChange={(value) => {
                            setRequirements(value);
                            form.setFieldsValue({ requirements: value });
                        }} />
                    </Form.Item>

                    <Form.Item
                        label="Open Date"
                        name="open_date"
                        rules={[{ required: true, message: 'Please select open date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Close Date"
                        name="close_date"
                        rules={[{ required: true, message: 'Please select close date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    {/* <Form.Item label="Status" name="status" initialValue="Draft">
                        <Select>
                            <Option value="Draft">Draft</Option>
                            <Option value="Open">Open</Option>
                            <Option value="Close">Close</Option>
                        </Select>
                    </Form.Item> */}

                </div>

                {/* Footer Actions */}
                {/* <Form.Item>
                    <div className="flex gap-3 justify-end">
                        <button onClick={handleCancel} className={`${Styles.btnCancel}`}>Cancel</button>
                        <button type="primary" htmlType="submit" className={`${Styles.btnCreate}`}>
                            Save
                        </button>
                    </div>
                </Form.Item> */}
                <div 
                    className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                    style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}
                >
                    <button onClick={handleCancel} className={`${Styles.btnCancel}`}>Cancel</button>
                    <button type="primary" htmlType="submit" className={`${Styles.btnCreate}`}>
                        Save
                    </button>
                </div>
            </Form>
            </Card>
        </div>
        </div>
    )
}

export default CreateJobPostingPage