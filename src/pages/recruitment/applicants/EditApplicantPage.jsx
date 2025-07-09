import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, DatePicker, Select, Upload,
  Button, Row, Col, message, Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { getJobPostingsApi } from '../../../services/jobPosting';
import { getCitiesApi } from '../../../services/cityApi';
import { getApplicantApi, updateApplicantApi } from '../../../services/applicant';
import { FaRegImages } from 'react-icons/fa';
import { Styles } from '../../../utils/CsStyle';
import uploadUrl from '../../../services/uploadApi';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';

const { Option } = Select;

const EditApplicantPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, content } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [jobPostings, setJobPostings] = useState([]);
  const [provinces, setProvinces] = useState([]);

  // Manage photo and CV files in state (not controlled by Form)
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [cvFileList, setCvFileList] = useState([]);

  // Load job postings and provinces
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobPostingsApi();
        setJobPostings(jobs);
      } catch {
        message.error("Failed to load job postings");
      } finally {
        setLoadingJobs(false);
      }
    };
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
    fetchJobs();
    fetchProvinces();
  }, []);

  // Load applicant data
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        const data = await getApplicantApi(id);
        form.setFieldsValue({
          ...data,
          dob: data.dob ? dayjs(data.dob) : null,
          job_posting_id: data.job_posting_id?._id || data.job_posting_id,
          current_province: data.current_province,
          // add more fields as needed
        });

        // Set photo preview and fileList state if photo exists
        if (data.photo) {
          setPreviewImage(`${uploadUrl}/uploads/applicants/${encodeURIComponent(data.photo)}`);
          setFileList([
            {
              uid: '-1',
              name: data.photo,
              status: 'done',
              url: `${uploadUrl}/uploads/applicants/${encodeURIComponent(data.photo)}`,
              originFileObj: null,
            },
          ]);
        } else {
          setFileList([]);
          setPreviewImage('');
        }

        // Set CV fileList state if CV exists
        if (data.cv) {
          setCvFileList([
            {
              uid: '-1',
              name: data.cv,
              status: 'done',
              url: `${uploadUrl}/uploads/applicants/${encodeURIComponent(data.cv)}`,
            },
          ]);
        } else {
          setCvFileList([]);
        }
      } catch {
        message.error("Failed to load applicant data");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [id, form]);

  // Handle photo upload changes
  const onPhotoChange = ({ fileList }) => {
    setFileList(fileList);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      getBase64(fileList[0].originFileObj).then(setPreviewImage);
    } else if (fileList.length === 0) {
      setPreviewImage('');
    }
  };

  // Handle CV upload changes
  const onCvChange = ({ fileList }) => {
    setCvFileList(fileList);
  };

  // Submit form handler
  const onFinish = async (values) => {
    const formData = new FormData();

    // Append all normal fields except photo and cv
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'dob' && value) {
        formData.append(key, value.format('YYYY-MM-DD'));
      } else if (key !== 'photo' && key !== 'cv') {
        formData.append(key, value);
      }
    });

    // Append photo file if exists (take from fileList state)
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('photo', fileList[0].originFileObj);
    }

    // Append CV file if exists
    if (cvFileList.length > 0 && cvFileList[0].originFileObj) {
      formData.append('cv', cvFileList[0].originFileObj);
    }

    try {
      await updateApplicantApi(id, formData);
      message.success("Applicant updated successfully!");
      navigate('/applicants');
    } catch {
      message.error("Failed to update applicant.");
    }
  };

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['applicants'], path: '/applicants' },
    { breadcrumbName: content['editApplicant'] },
  ];

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មាន{content['applicants']}</h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className='mt-4'>
        <Card title={content['editApplicant']} className="shadow custom-card">
          <Form form={form} layout="vertical" onFinish={onFinish} encType="multipart/form-data">
            <Row gutter={16}>
              {/* Left column: Photo + CV */}
              <Col xs={24} md={6}>
                <div className="flex justify-center flex-col items-center">
                  <Form.Item
                    // REMOVE valuePropName="fileList" and getValueFromEvent to avoid binding fileList to Form
                  >
                    <Upload
                      listType="picture"
                      maxCount={1}
                      accept="image/*"
                      onChange={onPhotoChange}
                      beforeUpload={() => false} // Prevent automatic upload
                      fileList={fileList}
                      showUploadList={false} // Hide default list, you show preview manually
                    >
                      <div className="border mt-2 relative border-dashed bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer hover:border-blue-500 w-[180px] h-[200px] flex items-center justify-center overflow-hidden">
                        {previewImage ? (
                          <>
                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 text-xs whitespace-nowrap">
                              {content['uploadImage'] || "Upload Image"}
                            </p>
                            <img
                              src={previewImage}
                              alt="Uploaded"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
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
                  // Remove valuePropName="fileList" to avoid form binding
                >
                  <Upload
                    name="cv"
                    beforeUpload={() => false}
                    onChange={onCvChange}
                    fileList={cvFileList}
                  >
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

                  {/* Add your other form fields here */}
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

                  {/* Add other fields as needed */}
                   <Col xs={24} md={12}>
                    <Form.Item label="Phone Number" name="phone_no" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Email" name="email">
                      <Input type="email" />
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
              <button onClick={() => navigate("/applicants")} className={`${Styles.btnCancel}`}>Cancel</button>
              <button type="submit" className={`${Styles.btnUpdate}`}>Update</button>
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

export default EditApplicantPage;
