import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, DatePicker, Select, Upload,
  Button, Row, Col, message, Spin, Modal
} from 'antd';
import {
  UploadOutlined, UserOutlined, PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Styles } from '../../../utils/CsStyle';
import { getJobPostingsApi } from '../../../services/jobPosting';
import dayjs from 'dayjs';
import { getCitiesApi } from '../../../services/cityApi';
import { createApplicantApi } from '../../../services/applicant';

const { Option } = Select;

const CreateApplicantPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { content } = useAuth();

  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const [jobPostings, setJobPostings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobs = await getJobPostingsApi();

                const openJobs = jobs.filter(job => {
                    const now = dayjs();
                    const open = job.open_date ? dayjs(job.open_date) : null;
                    const close = job.close_date ? dayjs(job.close_date) : null;

                    return (
                        job.status === true &&
                        open && close &&
                        now.isAfter(open) &&
                        now.isBefore(close)
                    );
                });

                setJobPostings(openJobs);
            } catch (error) {
                message.error("Failed to load job postings");
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        const fetchProvinces = async () => {
        try {
            const provs = await getCitiesApi();
            setProvinces(provs);
        } catch (error) {
            message.error("Failed to load provinces");
        } finally {
            setLoadingProvinces(false);
        }
        };

        fetchProvinces();
    }, []);

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: "Applicants", path: '/applicants' },
        { breadcrumbName: "Create Applicant" },
    ];

    const handleCancelPreview = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const handleChangePhoto = ({ fileList }) => setFileList(fileList);

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const handleCancel = () => {
        navigate("/applicants");
    };

    const onFinish = async (values) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'dob') {
            formData.append(key, value.format('YYYY-MM-DD'));
            } else if (key === 'photo' || key === 'cv') {
            if (value?.[0]?.originFileObj) {
                formData.append(key, value[0].originFileObj);
            }
            } else {
            formData.append(key, value);
            }
        });

        try {
            await createApplicantApi(formData);
            message.success("Applicant created successfully!");
            navigate('/applicants');
        } catch (error) {
            message.error("Failed to create applicant.");
        }
    };

  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} />
      <div className='mt-4'>
        <Card title="Create Applicant">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              {/* Left Column - Photo Upload */}
              <Col xs={24} md={6}>
                <Form.Item
                  name="photo"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[{ required: true, message: 'Please upload a photo' }]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChangePhoto}
                    beforeUpload={() => false}
                  >
                    {fileList.length >= 1 ? null : (
                      <div style={{ width: 96, height: 144, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/747/747545.png"
                          alt="Upload"
                          style={{ width: 40, height: 40, opacity: 0.5 }}
                        />
                        <div style={{ fontSize: 12, color: '#888' }}>Upload Image</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
                <p className="text-xs mt-1 text-gray-500">Photo size: 4x6 ratio</p>
              </Col>

              {/* Right Column - Form Fields */}
              <Col xs={24} md={18}>
                <Row gutter={16}>
                  {/* Job Selection */}
                  <Col span={24}>
                    <Form.Item
                      label="Job Posting"
                      name="job_posting_id"
                      rules={[{ required: true, message: 'Please select a job posting' }]}
                    >
                      {loadingJobs ? (
                        <Spin size="small" />
                      ) : (
                        <Select placeholder="Select an open job posting">
                            {jobPostings
                                .filter(job => job?._id && job?.job_title)
                                .map(job => (
                                <Option key={job._id} value={job._id}>
                                    {job.job_title}
                                </Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={24}><h3 className="text-lg font-semibold mb-4">Personal Information</h3></Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Full Name (Khmer)" name="full_name_kh" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Full Name (English)" name="full_name_en" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                      <Select placeholder="Select gender">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Marital Status" name="material_status">
                      <Select placeholder="Select marital status">
                        <Option value="Single">Single</Option>
                        <Option value="Married">Married</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Phone Number" name="phone_no" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Nationality" name="nationality">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={24}><h3 className="text-lg font-semibold mb-4 mt-6">Current Address</h3></Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Province"
                      name="current_province"
                      rules={[{ required: true, message: 'Please select a province' }]}
                    >
                      {loadingProvinces ? (
                        <Spin size="small" />
                      ) : (
                        <Select placeholder="Select province" showSearch optionFilterProp="children" filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                          {provinces.map((prov) => (
                            <Option key={prov._id || prov.id} value={prov.name || prov.province_name}>
                              {prov.name || prov.province_name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="District" name="current_district">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Commune" name="current_commune">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Village" name="current_village">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={24}><h3 className="text-lg font-semibold mb-4 mt-6">Documents</h3></Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Upload CV"
                      name="cv"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                    >
                      <Upload name="cv" beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                      </Upload>
                    </Form.Item>
                  </Col>

                  {/* Action Buttons */}
                  <Col span={24} className="mt-6">
                    <div className="flex justify-end space-x-4">
                      <button onClick={handleCancel} className={Styles.btnCancel}>
                        Cancel
                      </button>
                      <button type="primary" htmlType="submit" className={Styles.btnCreate}>
                        Create Applicant
                      </button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      {/* Preview Modal */}
      <Modal open={previewVisible} title="Preview" footer={null} onCancel={handleCancelPreview}>
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default CreateApplicantPage;
