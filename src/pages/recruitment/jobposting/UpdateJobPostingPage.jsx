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

const { Option } = Select;

const UpdateJobPostingPage = () => {
  const { id } = useParams();
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
    { breadcrumbName: 'Home', path: '/' },
    { breadcrumbName: 'Job Posting', path: '/job-postings' },
    { breadcrumbName: 'Edit Job Posting' }
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

        form.setFieldsValue({
          ...job,
          status: job.status,
          open_date: job.open_date ? dayjs(job.open_date) : null,
          close_date: job.close_date ? dayjs(job.close_date) : null,
          department: job.department?._id || job.department || null, // handle populated or id
          position: job.position?._id || job.position || null,
          job_type: job.job_type?._id || job.job_type || null,
          quantity_available: job.quantity_available,
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
      <CustomBreadcrumb items={breadcrumbItems} />
      <div className="mt-4">
        <Card title="Edit Job Posting">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Job Title" name="job_title" className="md:col-span-2" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Department"
                  onChange={value => setSelectedDepartment(value)}
                  allowClear
                >
                  {departments.map(dept => (
                    <Option key={dept._id} value={dept._id}>
                      {dept.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Position" name="position" rules={[{ required: true }]}>
                <Select placeholder="Select Position" allowClear>
                    {positions.map(pos => (
                        <Option key={pos._id} value={pos._id}>
                        {pos.title}
                        </Option>
                    ))}
                </Select>
              </Form.Item>

                <Form.Item label="Quantity Available" name="quantity_available" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Job Type" name="job_type" rules={[{ required: true }]}>
                    <Select placeholder="Select Job Type" allowClear>
                        {jobTypes.map(type => (
                            <Option key={type._id} value={type._id}>
                            {type.title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Responsibilities" required>
                    <ReactQuill value={responsibilities} onChange={setResponsibilities} />
                </Form.Item>

                <Form.Item label="Requirements" required>
                    <ReactQuill value={requirements} onChange={setRequirements} />
                </Form.Item>

                <Form.Item label="Open Date" name="open_date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Close Date" name="close_date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                {/* <Form.Item label="Status" name="status" valuePropName="checked" initialValue={true}>
                    <Switch />
                </Form.Item> */}
            </div>

                <Form.Item>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleCancel} className={`${Styles.btnCancel}`}>
                            Cancel
                        </button>
                        <button type="submit" className={`${Styles.btnUpdate}`}>
                            Update
                        </button>
                    </div>
                </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateJobPostingPage;
