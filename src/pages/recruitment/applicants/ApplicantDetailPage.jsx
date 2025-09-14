import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Avatar, Typography, message, Tooltip, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getApplicantApi } from '../../../services/applicantApi';
import { handleDownload } from '../../../services/uploadApi';
import uploadUrl from '../../../services/uploadApi';
import { ArrowLeftOutlined, CloudDownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { useAuth } from '../../../contexts/AuthContext';

const { Title } = Typography;

const ApplicantDetailPage = () => {
  const { content } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [jobApplication, setJobApplication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getApplicantApi(id);
        setApplicant(res.applicant);
        setJobApplication(res.jobApplications?.[0]);
      } catch (err) {
        console.error(err);
        message.error('Failed to load applicant data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <FullScreenLoader />;
  if (!applicant) return null;

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: `${content['informationKh']}${content['applicants']}`, path: '/applicants' },
    { breadcrumbName: content['detailInfo'] },
  ];

  const photoUrl = applicant.photo
    ? `${uploadUrl}/uploads/applicants/${encodeURIComponent(applicant.photo)}`
    : null;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-extrabold text-[#002060]">
          <FileTextOutlined className='mr-2' />{content['informationKh']}{content['applicants']}
        </h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <Card title={content['detailInfo']} className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Photo */}
          <div className="flex flex-col items-center">
            <div className="border border-dashed border-gray-300 w-[180px] h-[200px] rounded-lg overflow-hidden relative bg-gray-50">
              {photoUrl ? (
                <>
                  <img src={photoUrl} alt="applicant" className="w-full h-full object-cover" />
                  <p className="absolute bottom-2 right-1 bg-white border border-gray-300 rounded px-2 text-xs">
                    {content['photo']}
                  </p>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Photo
                </div>
              )}
            </div>

            {/* CV Download */}
            {applicant.cv && (
              <div className="mt-10 text-center">
                <p className="mb-1">{content['cv']}</p>
                <Tooltip title={content['download']}>
                  <Button
                    type="default"
                    shape="circle"
                    icon={<CloudDownloadOutlined />}
                    onClick={() =>
                      handleDownload(`uploads/applicants/${encodeURIComponent(applicant.cv)}`, applicant.cv)
                    }
                  />
                </Tooltip>
              </div>
            )}
          </div>

          {/* Detail info */}
          <div className="md:col-span-3">
            <Descriptions bordered column={2} labelStyle={{ width: 200 }}>
              <Descriptions.Item label={`${content['fullName']} (KH)`}>{applicant.full_name_kh}</Descriptions.Item>
              <Descriptions.Item label={`${content['fullName']} (EN)`}>{applicant.full_name_en}</Descriptions.Item>
              <Descriptions.Item label={content['gender']}>{applicant.gender}</Descriptions.Item>
              <Descriptions.Item label={content['dateOfBirth']}>
                {applicant.dob ? dayjs(applicant.dob).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={content['maritalStatus']}>{applicant.marital_status}</Descriptions.Item>
              <Descriptions.Item label={content['phone']}>{applicant.phone_no}</Descriptions.Item>
              <Descriptions.Item label={content['email']}>{applicant.email || '-'}</Descriptions.Item>
              <Descriptions.Item label={content['appliedDate']}>
                {jobApplication?.applied_date ? dayjs(jobApplication.applied_date).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={content['jobTitle']}>
                {jobApplication?.job_id?.job_title || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={content['status']}>
                {jobApplication?.status || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={content['province']}>{applicant.current_province}</Descriptions.Item>
              <Descriptions.Item label={content['district']}>{applicant.current_district}</Descriptions.Item>
              <Descriptions.Item label={content['commune']}>{applicant.current_commune}</Descriptions.Item>
              <Descriptions.Item label={content['village']}>{applicant.current_village}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicantDetailPage;
