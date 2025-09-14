import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, DatePicker, Select, Upload,
  Button, Row, Col, message, Spin
} from 'antd';
import { FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { getJobPostingsApi } from '../../../services/jobPosting';
import { getCitiesApi } from '../../../services/cityApi';
import { getApplicantApi, updateApplicantApi } from '../../../services/applicantApi';
import { updateJobApplicationApi } from '../../../services/jobApplicationApi';
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
  const [jobApplicationId, setJobApplicationId] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [cvFileList, setCvFileList] = useState([]);

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

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        const data = await getApplicantApi(id);
        const applicant = data.applicant;
        const jobApplications = data.jobApplications || [];
        const app = jobApplications[0];

        if (app) {
          setJobApplicationId(app._id);
          form.setFieldsValue({
            job_posting_id: app.job_id?._id,
            applied_date: app.applied_date ? dayjs(app.applied_date) : null,
          });
        }

        form.setFieldsValue({
          full_name_kh: applicant.full_name_kh || '',
          full_name_en: applicant.full_name_en || '',
          gender: applicant.gender || '',
          dob: applicant.dob ? dayjs(applicant.dob) : null,
          marital_status: applicant.marital_status || '',
          phone_no: applicant.phone_no || '',
          email: applicant.email || '',
          current_province: applicant.current_province || '',
          current_district: applicant.current_district || '',
          current_commune: applicant.current_commune || '',
          current_village: applicant.current_village || '',
        });

        // ✅ Set preview for photo
        if (applicant.photo) {
          const photoUrl = `${uploadUrl}/uploads/applicants/${encodeURIComponent(applicant.photo)}`;
          setPreviewImage(photoUrl);
          setFileList([{
            uid: '-1',
            name: applicant.photo,
            status: 'done',
            url: photoUrl,
            originFileObj: null,
          }]);
        }

        // ✅ Set preview for CV
        if (applicant.cv) {
          const cvUrl = `${uploadUrl}/uploads/applicants/${encodeURIComponent(applicant.cv)}`;
          setCvFileList([{
            uid: '-1',
            name: applicant.cv,
            status: 'done',
            url: cvUrl,
            originFileObj: null,
          }]);
        }

      } catch (error) {
        console.error(error);
        message.error("Failed to load applicant data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id, form]);

  const onPhotoChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList[0]?.originFileObj) getBase64(fileList[0].originFileObj).then(setPreviewImage);
    if (fileList.length === 0) setPreviewImage('');
  };

  const onCvChange = ({ fileList }) => {
    setCvFileList(fileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'dob' && value) {
        formData.append(key, value.format('YYYY-MM-DD'));
      } else if (!['photo', 'cv', 'applied_date', 'job_posting_id'].includes(key)) {
        formData.append(key, value);
      }
    });

    if (fileList[0]?.originFileObj) {
      formData.append('photo', fileList[0].originFileObj);
    }

    if (cvFileList[0]?.originFileObj) {
      formData.append('cv', cvFileList[0].originFileObj);
    }

    try {
      await updateApplicantApi(id, formData);

      if (jobApplicationId) {
        await updateJobApplicationApi(jobApplicationId, {
          applicant_id: id,
          job_id: values.job_posting_id,
          applied_date: values.applied_date?.format('YYYY-MM-DD'),
        });
      }

      message.success(content['updateSuccessFully'] || "Applicant updated successfully!");
      navigate('/applicants');
    } catch (err) {
      console.error(err);
      message.error(content['failedToUpdate'] || "Failed to update applicant.");
    }
  };

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: `${content['informationKh']}${content['applicants']}`, path: '/applicants' },
    { breadcrumbName: content['editApplicant'] },
  ];

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#002060]'><FileTextOutlined className='mr-2' />{content['informationKh']}{content['applicants']}</h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div className='mt-4'>
        <Card title={content['editApplicant']} className="shadow custom-card">
          <Form form={form} layout="vertical" onFinish={onFinish} encType="multipart/form-data">
            <Row gutter={16}>
              <Col xs={24} md={6}>
                <div className="flex justify-center flex-col items-center">
                  <Form.Item>
                    <Upload
                      listType="picture"
                      maxCount={1}
                      accept="image/*"
                      onChange={onPhotoChange}
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
                            <img src={previewImage} alt="Uploaded" className="w-full h-full object-cover" />
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

                <Form.Item label={content['uploadCV']}>
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

              <Col xs={24} md={18}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={content['job']}
                      name="job_posting_id"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select job"
                        loading={loadingJobs}
                        showSearch
                        optionFilterProp="children"
                      >
                        {jobPostings.map(job => (
                          <Option key={job._id} value={job._id}>{job.job_title}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label={content['appliedDate']}
                      name="applied_date"
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                      // disabledDate={d => d && d > dayjs().endOf('day')}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}><Form.Item label={`${content['fullName']} (KH)`} name="full_name_kh" rules={[{ required: true }]}><Input /></Form.Item></Col>
                  <Col xs={24} md={12}><Form.Item label={`${content['fullName']} (EN)`} name="full_name_en" rules={[{ required: true }]}><Input /></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label={content['gender']} name="gender" rules={[{ required: true }]}><Select><Option value="Male">Male</Option><Option value="Female">Female</Option></Select></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label={content['dateOfBirth']} name="dob" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label={content['maritalStatus']} name="marital_status"><Select><Option value="Single">Single</Option><Option value="Married">Married</Option><Option value="Other">Other</Option></Select></Form.Item></Col>
                  <Col xs={24} md={12}><Form.Item label={content['phone']} name="phone_no" rules={[{ required: true }]}><Input /></Form.Item></Col>
                  <Col xs={24} md={12}><Form.Item label={content['email']} name="email"><Input type="email" /></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label={content['province']} name="current_province" rules={[{ required: true }]}>{loadingProvinces ? <Spin size="small" /> : <Select showSearch placeholder="Select province">{provinces.map((prov) => (<Option key={prov._id || prov.id} value={prov.name || prov.province_name}>{prov.name || prov.province_name}</Option>))}</Select>}</Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label={content['district']} name="current_district"><Input /></Form.Item></Col>
                  <Col xs={24} md={8}><Form.Item label={content['commune']} name="current_commune"><Input /></Form.Item></Col>
                  <Col xs={24}><Form.Item label={content['village']} name="current_village"><Input /></Form.Item></Col>
                </Row>
              </Col>
            </Row>

            <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
              style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>

              <button type='button' onClick={() => navigate("/applicants")} className={`${Styles.btnCancel}`}>{content['cancel']}</button>
              <button type="submit" className={`${Styles.btnUpdate}`}>{content['update']}</button>
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
