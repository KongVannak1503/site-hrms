import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getApplicantsByJobApi } from '../../../services/applicant';
import { Avatar, message, Space, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import uploadUrl from '../../../services/uploadApi';
import dayjs from 'dayjs';
import { getJobPostingApi } from '../../../services/jobPosting';
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import ApplicantStatusSummary from '../applicants/ApplicantStatusSummary';

const ApplicantListPage = () => {
    const { jobId } = useParams();
    const { isLoading, content } = useAuth();
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['jobPosting'], path: '/job-postings' },
        { breadcrumbName: content['jobApplied'] }
    ];

    useEffect(() => {
        const fetchApplicants = async () => {
        try {
            const [job, applicants] = await Promise.all([
                getJobPostingApi(jobId),             // <-- fetch job
                getApplicantsByJobApi(jobId),     // <-- fetch applicants
            ]);
            setJobTitle(job.job_title);
            setApplicants(applicants);
        } catch (err) {
            message.error('Failed to load applicants');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        if (jobId) fetchApplicants();
    }, [jobId]);

    const columns = [
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            render: (photo, record) => (
                <Avatar
                src={photo ? `${uploadUrl}/uploads/applicants/${photo}` : undefined}
                >
                {!photo && record.full_name_en?.[0]}
                </Avatar>
            ),
        },
        {
            title: 'Full Name (EN)',
            dataIndex: 'full_name_en',
            key: 'full_name_en',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: gender => <Tag color={gender === 'Male' ? 'blue' : 'pink'}>{gender}</Tag>
        },
        {
            title: 'Phone',
            dataIndex: 'phone_no',
            key: 'phone_no',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = 'default';
                if (status === 'Hired') color = 'green';
                else if (status === 'Fail') color = 'red';
                else if (status === 'Shortlist') color = 'blue';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Applied At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => dayjs(date).format('YYYY-MM-DD HH:mm')
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space>
                <Tooltip title="View">
                    <button
                    onClick={() => {
                        setSelectedApplicant(record);
                        setViewDrawerVisible(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    >
                    <EyeOutlined />
                    </button>
                </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between">
                <h1 className='text-xl font-extrabold text-[#17a2b8]'>
                    ព័ត៌មាន{content['jobPosting']}
                </h1>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>

            <div className="p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4">Applicants for Job: {jobTitle}</h2>

                <ApplicantStatusSummary applicants={applicants} />
                <Table
                    columns={columns}
                    dataSource={applicants}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </div>
    );
}

export default ApplicantListPage