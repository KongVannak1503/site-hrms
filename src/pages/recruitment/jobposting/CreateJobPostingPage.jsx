import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getPositionsByDepartmentApi } from '../../../services/positionApi';
import { getJobTypesApi } from '../../../services/jobType';
import { createJobPostingApi } from '../../../services/jobPosting';
import { FileTextOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateJobPostingPage = () => {
  const { isLoading, content, language } = useAuth();
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
    { breadcrumbName: `${content['informationKh']}${content['jobPosting']}`, path: '/job-postings' },
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

      await createJobPostingApi(formData);

      message.success(content['createSuccessFully'] || 'Job posting created successfully!');
      navigate('/job-postings');
    } catch (error) {
      console.error(content['failedToCreate'] || 'Error creating job posting:', error);
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
        <h1 className='text-xl font-extrabold text-[#002060]'>
          <FileTextOutlined className='mr-2' />{content['informationKh']}{content['jobPosting']}
        </h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className='mt-4'>
        <Card title={content['createJobPosting']}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={content['jobTitle']}
                name="job_title"
                rules={[{ required: true, message: 'Please enter job title' }]}
                className="md:col-span-2"
              >
                <Input placeholder="e.g. Senior Software Engineer" />
              </Form.Item>

              <Form.Item
                label={content['department']}
                name="department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select
                  placeholder="Select Department"
                  onChange={(value) => setSelectedDepartment(value)}
                >
                  {departments.map((dept) => (
                    <Option key={dept._id} value={dept._id}>
                      {language == 'khmer' ? dept.title_kh : dept.title_en}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={content['position']}
                name="position"
                rules={[{ required: true, message: 'Please select position' }]}
              >
                <Select placeholder="Select Position">
                  {positions.map((pos) => (
                    <Option key={pos._id} value={pos._id}>
                      {language == 'khmer' ? pos.title_kh : pos.title_en}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={content['pax']}
                name="quantity_available"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label={content['jobType']}
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
                label={content['responsibilities']}
                name="responsibilities"
                rules={[{ required: true, message: 'Please enter responsibilities' }]}
              >
                <ReactQuill
                  theme="snow"
                  value={responsibilities}
                  onChange={(value) => {
                    setResponsibilities(value);
                    form.setFieldsValue({ responsibilities: value });
                  }}
                />
              </Form.Item>

              <Form.Item
                label={content['requirements']}
                name="requirements"
                rules={[{ required: true, message: 'Please enter requirements' }]}
              >
                <ReactQuill
                  theme="snow"
                  value={requirements}
                  onChange={(value) => {
                    setRequirements(value);
                    form.setFieldsValue({ requirements: value });
                  }}
                />
              </Form.Item>

              <Form.Item
                label={content['openDate']}
                name="open_date"
                rules={[{ required: true, message: 'Please select open date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label={content['closeDate']}
                name="close_date"
                rules={[{ required: true, message: 'Please select close date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              {/* ✅ Manual status selection */}
              <Form.Item
                label={content['status']}
                name="status"
                initialValue="Draft"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="Draft">
                    <span>
                      <span
                        style={{
                          height: 10,
                          width: 10,
                          backgroundColor: 'orange',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: 8,
                        }}
                      />
                      Draft
                    </span>
                  </Option>
                  <Option value="Open">
                    <span>
                      <span
                        style={{
                          height: 10,
                          width: 10,
                          backgroundColor: 'green',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: 8,
                        }}
                      />
                      Open
                    </span>
                  </Option>
                  <Option value="Close">
                    <span>
                      <span
                        style={{
                          height: 10,
                          width: 10,
                          backgroundColor: 'red',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: 8,
                        }}
                      />
                      Close
                    </span>
                  </Option>
                </Select>
              </Form.Item>
            </div>

            <div
              className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
              style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}
            >
              <button onClick={handleCancel} className={`${Styles.btnCancel}`}>{content['cancel']}</button>
              <button type="submit" className={`${Styles.btnCreate}`}>
                {content['save']}
              </button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateJobPostingPage;
