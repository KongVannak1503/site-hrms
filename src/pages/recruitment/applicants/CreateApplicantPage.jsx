import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, DatePicker, Select, Upload,
  Button, Row, Col, message, Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Styles } from '../../../utils/CsStyle';
import { getJobPostingsApi } from '../../../services/jobPosting';
import { createApplicantApi } from '../../../services/applicantApi';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { getCitiesApi } from '../../../services/cityApi';
import { FaRegImages } from 'react-icons/fa';
import { applyToJobApi } from '../../../services/jobApplicationApi';

// Extend plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

        const openJobs = jobs.filter(job =>
          job.status === 'Open' &&
          dayjs(job.open_date).isSameOrBefore(now, 'day') &&
          dayjs(job.close_date).isSameOrAfter(now, 'day')
        );

        setJobPostings(openJobs);
      } catch (error) {
        console.error(error);
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
      const createdApplicant = await createApplicantApi(formData);

      await applyToJobApi({
        applicant_id: createdApplicant._id,
        job_id: values.job_posting_id
      });

      message.success("Applicant created and applied successfully!");
      navigate('/applicants');
    } catch (err) {
      console.error(err);
      message.error("Failed to create applicant or apply to job.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>
          ព័ត៌មាន{content['applicants']}
        </h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className='mt-4'>
        <Card title={content['createApplicant']} className="shadow custom-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            encType="multipart/form-data"
          >
            <Row gutter={16}>
              {/* Left: Uploads */}
              <Col xs={24} md={6}>
                <div className="flex flex-col items-center">
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
                      <div className="border mt-2 border-dashed bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer hover:border-blue-500 w-[180px] h-[200px] flex items-center justify-center overflow-hidden relative">
                        {previewImage ? (
                          <>
                            <img
                              src={previewImage}
                              alt="Uploaded"
                              className="w-full h-full object-cover"
                            />
                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 text-xs">
                              {content['uploadImage'] || "Upload Image"}
                            </p>
                          </>
                        ) : (
                          <>
                            <FaRegImages className="text-gray-400" style={{ width: '100px', height: '100px' }} />
                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 text-xs">
                              {content['uploadImage'] || "Upload Image"}
                            </p>
                          </>
                        )}
                      </div>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Upload CV"
                    name="cv"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload name="cv" beforeUpload={() => false} maxCount={1}>
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </div>
              </Col>

              {/* Right: Fields */}
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
                              {job.job_title} ({dayjs(job.close_date).format("YYYY-MM-DD")})
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}><Form.Item label="Full Name (Khmer)" name="full_name_kh" rules={[{ required: true }]}><Input /></Form.Item></Col>
                  <Col xs={24} md={12}><Form.Item label="Full Name (English)" name="full_name_en" rules={[{ required: true }]}><Input /></Form.Item></Col>

                  <Col xs={24} md={8}><Form.Item label="Gender" name="gender" rules={[{ required: true }]}><Select><Option value="Male">Male</Option><Option value="Female">Female</Option></Select></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label="Marital Status" name="marital_status"><Select><Option value="Single">Single</Option><Option value="Married">Married</Option><Option value="Other">Other</Option></Select></Form.Item></Col>

                  <Col xs={24} md={12}><Form.Item label="Phone Number" name="phone_no" rules={[{ required: true }]}><Input /></Form.Item></Col>
                  <Col xs={24} md={12}><Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Province"
                      name="current_province"
                      rules={[{ required: true }]}
                    >
                      {loadingProvinces ? (
                        <Spin size="small" />
                      ) : (
                        <Select showSearch placeholder="Select province">
                          {provinces.map((prov) => (
                            <Option key={prov._id || prov.id} value={prov.name || prov.province_name}>
                              {prov.name || prov.province_name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}><Form.Item label="District" name="current_district"><Input /></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label="Commune" name="current_commune"><Input /></Form.Item></Col>
                  <Col xs={24}><Form.Item label="Village" name="current_village"><Input /></Form.Item></Col>
                </Row>
              </Col>
            </Row>

            {/* Buttons */}
            <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
              style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
              <button onClick={handleCancel} className={Styles.btnCancel}>Cancel</button>
              <button type="submit" className={Styles.btnCreate}>Save</button>
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
