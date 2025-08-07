import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Avatar, Typography, message, Table } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { getJobPostingApi } from '../../../services/jobPosting';
 import { getJobApplicationsByJob } from '../../../services/jobApplicationApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import uploadUrl from '../../../services/uploadApi';

const { Title } = Typography;

const JobPostingDetailPage = () => {
    const { isLoading, content } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['jobPosting'], path: '/job-postings'},
        { breadcrumbName: content['detailInfo'] },
    ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobDetail = await getJobPostingApi(id);
        setJob(jobDetail);

        const applied = await getJobApplicationsByJob(id);
        setApplicants(applied);
      } catch (err) {
        message.error("Failed to load job detail");
      }
    };

    fetchData();
  }, [id]);

  if (!job) return null;

  const columns = [
    {
        title: content['applicantName'],
        key: 'applicant',
        render: (_, record) => {
            const applicant = record.applicant_id;
            const jobTitle = record.job_id?.job_title;
            const photo = applicant?.photo;
            const position = applicant?.position; // if available in applicant

            return (
            <div className="flex gap-3 items-center">
                <Avatar
                src={photo ? `${uploadUrl}/uploads/applicants/${encodeURIComponent(photo)}` : undefined}
                size={50}
                >
                {!photo && applicant?.full_name_en?.charAt(0)}
                </Avatar>
                <div className="flex flex-col">
                <span className="font-medium">{applicant?.full_name_en || '—'}</span>
                <span className="text-gray-500 text-xs">
                    {position?.title || position || jobTitle || '—'}
                </span>
                </div>
            </div>
            );
        }
    },
    {
        title: content['gender'],
        dataIndex: ['applicant_id', 'gender'],
        key: 'gender',
    },
    {
        title: content['phone'],
        dataIndex: ['applicant_id', 'phone_no'],
        key: 'phone_no',
    },
    {
        title: content['email'],
        dataIndex: ['applicant_id', 'email'],
        key: 'email',
    },
    {
        title: content['appliedDate'],
        dataIndex: 'applied_date',
        key: 'applied_date',
        render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '-',
    },
    {
        title: content['status'],
        dataIndex: 'status',
        key: 'status',
        render: (status) => status || '-',
    },
  ];

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div>
        <div className="flex justify-between mb-4">
            <h1 className='text-xl font-extrabold text-[#17a2b8]'>
                ព័ត៌មាន{content['jobPosting']}
            </h1>
            <CustomBreadcrumb items={breadcrumbItems} />
        </div>

        <div className='mt-4'>
            <Card className="mb-6 shadow">
                <Title level={4} className="kh-title">{job.job_title}</Title>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label={content['department']}>{job.department?.title}</Descriptions.Item>
                    <Descriptions.Item label={content['position']}>{job.position?.title}</Descriptions.Item>
                    <Descriptions.Item label={content['jobType']}>{job.job_type?.title}</Descriptions.Item>
                    <Descriptions.Item label={content['pax']}>{job.quantity_available}</Descriptions.Item>
                    <Descriptions.Item label={content['openDate']}>{dayjs(job.open_date).format('DD-MM-YYYY')}</Descriptions.Item>
                    <Descriptions.Item label={content['closeDate']}>{dayjs(job.close_date).format('DD-MM-YYYY')}</Descriptions.Item>
                    <Descriptions.Item label={content['status']}>{job.status}</Descriptions.Item>
                </Descriptions>

                <Descriptions
                    bordered
                    column={1}
                    className="mt-6"
                    title={content['additionalInformation']}
                    labelStyle={{ width: 200 }}
                >
                    <Descriptions.Item label={content['responsibilities']}>
                        <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.responsibilities || '<p>-</p>' }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label={content['requirements']}>
                        <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: job.requirements || '<p>-</p>' }}
                        />
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            
            <div className='mt-2'></div>
            <Card title={content['applicants']} className="shadow">
                <Table
                    className='custom-pagination custom-checkbox-table'
                    rowKey={(record) => record._id}
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    dataSource={applicants}
                    bordered
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} ${content['of']} ${total} ${content['items']}`,
                        locale: {
                            items_per_page: content['page'],
                        },
                        onChange: (page, pageSize) => {
                            setPagination({
                                ...pagination,
                                current: page,
                                pageSize: pageSize,
                            });
                        }
                    }}
                />
            </Card>
        </div>
    </div>
  );
};

export default JobPostingDetailPage;
