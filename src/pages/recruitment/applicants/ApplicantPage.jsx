import React, { useState, useEffect } from 'react';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Table, Tag, Button, Popconfirm, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../../utils/CsStyle';
import { EyeOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { getApplicantsApi, updateApplicantStatusApi } from '../../../services/applicant';

const ApplicantPage = () => {
  const { isLoading, content } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: "Applicants" }
  ];

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getApplicantsApi();
      setApplicants(data);
    } catch (error) {
      message.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/applicants/create');
  };

  // Update status handler for "Shortlist"
  const handleShortlist = async (applicantId) => {
    try {
      // Call API to update status
      await updateApplicantStatusApi(applicantId, 'Shortlist', user?._id);
      message.success("Applicant shortlisted successfully");

      // Refresh applicant list to reflect update
      fetchApplicants();
    } catch (error) {
      message.error("Failed to update applicant status");
    }
  };

  const filteredApplicants = applicants.filter((item) =>
    item.full_name_en?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.full_name_kh?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      render: (text) => (
        text
          ? <img
              src={`http://localhost:3000/api/uploads/applicants/${encodeURIComponent(text)}`}
              alt="photo"
              width={60}
              height={60}
              style={{ borderRadius: '5px', objectFit: 'cover' }}
            />
          : '-'
      )
    },
    {
      title: 'Full Name (KH)',
      dataIndex: 'full_name_kh',
    },
    {
      title: 'Full Name (EN)',
      dataIndex: 'full_name_en',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/applicants/view/${record._id}`)} />
          <Button icon={<FormOutlined />} onClick={() => navigate(`/applicants/edit/${record._id}`)} />
          {record.status !== 'Shortlist' && (
            <Popconfirm
              title="Are you sure to shortlist this applicant?"
              onConfirm={() => handleShortlist(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" >
                Shortlist
              </Button>
            </Popconfirm>
          )}
        </div>
      )
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Review': return 'blue';
      case 'Shortlist': return 'cyan';
      case 'Interview': return 'gold';
      case 'Fail': return 'red';
      case 'Reserve': return 'orange';
      case 'Hired': return 'green';
      default: return 'default';
    }
  };

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} />

      <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <h5 className='text-lg font-semibold'>Applicants</h5>
          <div className='flex gap-3 mt-2 sm:mt-0'>
            <Input
              placeholder={content['searchAction']}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleCreate} className={Styles.btnCreate}>
              <PlusOutlined /> {`${content['create']} ${content['jobPosting']}`}
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredApplicants}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </div>
  );
};

export default ApplicantPage;
