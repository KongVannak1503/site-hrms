import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Select, DatePicker, Switch, message } from 'antd';
import { getJobPostingApi, updateJobPostingApi } from '../../../services/jobPosting';
import { getDepartmentsApi } from '../../../services/departmentApi';
import { getPositionsByDepartmentApi } from '../../../services/positionApi';
import { getJobTypesApi } from '../../../services/jobType';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Styles } from '../../../utils/CsStyle';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';

const { Option } = Select;

const UpdateJobPostingPage = () => {
  const { id } = useParams();
  const { content, language } = useAuth();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const navigate = useNavigate();

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['jobPosting'], path: '/job-postings' },
    { breadcrumbName: content['editJobPosting'] }
  ];

  // Load job posting + departments + job types
  useEffect(() => {
    const loadData = async () => {
      try {
        const [job, depts, types] = await Promise.all([
          getJobPostingApi(id),
          getDepartmentsApi(),
          getJobTypesApi()
        ]);

        setDepartments(depts);
        setJobTypes(types);

        setResponsibilities(job.responsibilities || '');
        setRequirements(job.requirements || '');

        const normalizedStatus = typeof job.status === 'boolean'
          ? (job.status ? 'Open' : 'Draft')
          : job.status;

        form.setFieldsValue({
          ...job,
          status: normalizedStatus,
          open_date: job.open_date ? dayjs(job.open_date) : null,
          close_date: job.close_date ? dayjs(job.close_date) : null,
          department: job.department?._id || job.department || null, // handle populated or id
          position: job.position?._id || job.position || null,
          job_type: job.job_type?._id || job.job_type || null,
          quantity_available: job.quantity_available,
          responsibilities: job.responsibilities || '',
          requirements: job.requirements || '',
        });

        setSelectedDepartment(job.department?._id || job.department || null);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load job posting:', err);
        message.error('Failed to load job posting');
      }
    };

    loadData();
  }, [id, form]);

  // Load positions when department changes
  useEffect(() => {
    const fetchPositions = async () => {
      if (selectedDepartment) {
        try {
          const res = await getPositionsByDepartmentApi(selectedDepartment);
          setPositions(res);
        } catch (err) {
          console.error('Failed to load positions:', err);
          message.error('Failed to load positions');
          setPositions([]);
        }
      } else {
        setPositions([]);
      }
    };

    fetchPositions();
  }, [selectedDepartment]);

  const onFinish = async (values) => {
    try {
      // Combine form values + quill contents
      const formData = {
        ...values,
        responsibilities,
        requirements,
        open_date: values.open_date?.toISOString(),
        close_date: values.close_date?.toISOString(),
      };

      await updateJobPostingApi(id, formData);
      message.success('Job posting updated successfully');
      navigate('/job-postings');
    } catch (err) {
      console.error('Update failed:', err);
      message.error('Failed to update job posting');
    }
  };

  const handleCancel = () => navigate('/job-postings');

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#002060]'>
          ព័ត៌មាន{content['jobPosting']}
        </h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="mt-4 mb-4">
        <Card title={content['editJobPosting']}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label={content['jobTitle']} name="job_title" className="md:col-span-2" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label={content['department']} name="department" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Department"
                  onChange={value => setSelectedDepartment(value)}
                  allowClear
                >
                  {departments.map(dept => (
                    <Option key={dept._id} value={dept._id}>
                      {language == 'khmer' ? dept.title_kh : dept.title_en}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label={content['position']} name="position" rules={[{ required: true }]}>
                <Select placeholder="Select Position" allowClear>
                  {positions.map(pos => (
                    <Option key={pos._id} value={pos._id}>
                      {language == 'khmer' ? pos.title_kh : pos.title_en}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label={content['pax']} name="quantity_available" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label={content['jobType']} name="job_type" rules={[{ required: true }]}>
                <Select placeholder="Select Job Type" allowClear>
                  {jobTypes.map(type => (
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

              <Form.Item label={content['openDate']} name="open_date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label={content['closeDate']} name="close_date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label={content['status']} name="status" rules={[{ required: true }]}>
                <Select placeholder="Select Status">
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
              <button type="button" onClick={handleCancel} className={`${Styles.btnCancel}`}>{content['cancel']}</button>
              <button type="primary" htmlType="submit" className={`${Styles.btnUpdate}`}>
                {content['update']}
              </button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateJobPostingPage;
