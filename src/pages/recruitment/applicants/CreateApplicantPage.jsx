import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, DatePicker, Select, Upload,
  Button, Row, Col, message, Spin, Modal
} from 'antd';
import {
  UploadOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Styles } from '../../../utils/CsStyle';
import { getJobPostingsApi } from '../../../services/jobPosting';
import dayjs from 'dayjs';
import { getCitiesApi } from '../../../services/cityApi';
import { createApplicantApi } from '../../../services/applicant';
import { FaRegImages } from 'react-icons/fa';

const { Option } = Select;

const CreateApplicantPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { content } = useAuth();

  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobPostingsApi();
        const now = dayjs();
        const openJobs = jobs
          .filter(job => job.status && dayjs(job.open_date).isBefore(now) && dayjs(job.close_date).isAfter(now))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobPostings(openJobs);
      } catch {
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
      } catch {
        message.error("Failed to load provinces");
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['applicants'], path: '/applicants' },
    { breadcrumbName: content['createApplicant'] },
  ];

  const normFile = (e) => Array.isArray(e) ? e : e?.fileList;

  const handleCancel = () => navigate("/applicants");

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
    } catch {
      message.error("Failed to create applicant.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មាន{content['applicants']}</h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className='mt-4'>
        <Card title={content['createApplicant']} className="shadow custom-card">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              {/* Left column: Photo + CV */}
              <Col xs={24} md={6}>
                <div className="flex justify-center flex-col items-center">
                  <Form.Item
                    name="photo"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload
                      listType="picture"
                      maxCount={1}
                      accept="image/*"
                      onChange={({ fileList }) => {
                        setFileList(fileList);
                        if (fileList.length > 0) {
                          getBase64(fileList[0].originFileObj).then(setPreviewImage);
                        } else {
                          setPreviewImage('');
                        }
                      }}
                      beforeUpload={() => false}
                      fileList={fileList}
                      showUploadList={false}
                    >
                      <div className="border mt-2 relative border-dashed bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer hover:border-blue-500 w-[180px] h-[200px] flex items-center justify-center overflow-hidden">
                        {previewImage ? (
                          <>
                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 text-xs whitespace-nowrap">
                              {content['uploadImage'] || "Upload Image"}
                            </p>
                            {/* 🟡 Now clicking the whole image will allow change */}
                            <img
                              src={previewImage}
                              alt="Uploaded"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }}
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 text-xs whitespace-nowrap">
                              {content['uploadImage'] || "Upload Image"}
                            </p>
                            <FaRegImages style={{ width: '100px', height: '100px', color: '#ccc' }} />
                          </div>
                        )}
                      </div>
                    </Upload>
                  </Form.Item>
                </div>

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

              {/* Right column: Form fields */}
              <Col xs={24} md={18}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Job Posting"
                      name="job_posting_id"
                      rules={[{ required: true, message: 'Please select a job posting' }]}
                    >
                      {loadingJobs ? (
                        <Spin size="small" />
                      ) : (
                        <Select
                          placeholder="Select an open job posting"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {jobPostings.map((job) => (
                            <Option key={job._id} value={job._id}>
                              {job.job_title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>

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

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Province"
                      name="current_province"
                      rules={[{ required: true, message: 'Please select a province' }]}
                    >
                      {loadingProvinces ? (
                        <Spin size="small" />
                      ) : (
                        <Select placeholder="Select province" showSearch optionFilterProp="children">
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
                </Row>
              </Col>
            </Row>

            <div 
                className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}
            >
                <button onClick={handleCancel} className={`${Styles.btnCancel}`}>Cancel</button>
                <button type="submit" className={`${Styles.btnCreate}`}>
                    Save
                </button>
            </div>
          </Form>
        </Card>
      </div>
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
