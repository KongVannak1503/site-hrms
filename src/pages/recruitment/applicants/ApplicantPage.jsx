import React, { useState, useEffect } from 'react';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Form, Input, Table, Tag, Select,
  Tooltip, Space, message,
  Modal
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../../utils/CsStyle';
import {
  EyeOutlined, FormOutlined, PlusOutlined
} from '@ant-design/icons';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import {
  deleteApplicantApi,
  getApplicantsApi
} from '../../../services/applicantApi';
import uploadUrl from '../../../services/uploadApi';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { updateJobApplicationStatus } from '../../../services/jobApplicationApi';
import TestAssignmentModal from '../tests/testAssignmentModal';

const { Option } = Select;

const ApplicantPage = () => {
  const { isLoading, content } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const navigate = useNavigate();
  const [testModalData, setTestModalData] = useState({
    visible: false,
    jobAppId: null,
    applicant: null
  });

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getApplicantsApi();
      setApplicants(data);
    } catch {
      message.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => navigate('/applicants/create');

  const handleUpdate = (id) => navigate(`/applicants/edit/${id}`);

  const handleDelete = async (id) => {
    try {
      await deleteApplicantApi(id);
      setApplicants(applicants.filter(applicant => applicant._id !== id));
      message.success('Applicant deleted');
    } catch {
      message.error('Delete failed');
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch =
      applicant.full_name_en?.toLowerCase().includes(searchText.toLowerCase()) ||
      applicant.full_name_kh?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || applicant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const validTransitions = {
    applied: ['shortlisted'],
    shortlisted: ['test'],
    test: ['interview'],
    interview: ['hired', 'reserve', 'rejected'],
    hired: [],
    reserve: [],
    rejected: []
  };

  const handleStatusChange = async (jobAppId, newStatus, oldStatus, applicantData) => {
    if (!validTransitions[oldStatus]?.includes(newStatus)) {
      message.warning(`Cannot change status from ${oldStatus} to ${newStatus}`);
      return;
    }
    
    if (oldStatus === 'applied' && newStatus === 'shortlisted') {
      Modal.confirm({
        title: 'Confirm Shortlisting',
        content: 'Are you sure you want to mark this applicant as Shortlisted?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            await updateJobApplicationStatus(jobAppId, newStatus);
            message.success('Status updated to Shortlisted');
            fetchApplicants();
          } catch {
            message.error('Failed to update status');
          }
        }
      });
    } else if (oldStatus === 'shortlisted' && newStatus === 'test') {
      setTestModalData({
        visible: true,
        jobAppId,
        applicant: { ...applicantData, job_id: applicantData.job_application_id?.job_id || applicantData.job_id }
      });
    } else {
      try {
        await updateJobApplicationStatus(jobAppId, newStatus);
        message.success(`Status updated to ${newStatus}`);
        fetchApplicants();
      } catch {
        message.error('Failed to update status');
      }
    }
  };

  const columns = [
    {
      title: content['photo'],
      dataIndex: 'photo',
      render: (text) => text ? 
        <img 
          src={`${uploadUrl}/uploads/applicants/${encodeURIComponent(text)}`}
          className="w-[70px] h-[80px] rounded object-cover" 
        /> : '-'
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
      title: content['gender'],
      dataIndex: 'gender'
    },
    {
      title: content['phone'],
      dataIndex: 'phone_no',
    },
    {
      title: content['jobTitle'],
      dataIndex: 'job_title',
      render: (text) => text || '-'
    },
    {
      title: content['status'],
      dataIndex: 'status',
      render: (status, record) => {
        const jobAppId = record.job_application_id;
        return jobAppId ? (
          <Select
            value={status}
            onChange={(newStatus) => handleStatusChange(jobAppId, newStatus, status, record)}
            style={{ width: 140 }}
          >
            <Option value='applied'>Applied</Option>
            <Option value='shortlisted'>Shortlisted</Option>
            <Option value='test'>Test</Option>
            <Option value='interview'>Interview</Option>
            <Option value='hired'>Hired</Option>
            <Option value='reserve'>Reserve</Option>
            <Option value='rejected'>Rejected</Option>
          </Select>
        ) : (
          <Tag>-</Tag>
        );
      }
    },
    {
      title: content['action'],
      render: (_, record) => (
        <Space>
          <Tooltip title={content['edit']}>
            <button className={Styles.btnEdit} onClick={() => handleUpdate(record._id)}><FormOutlined /></button>
          </Tooltip>
          {record.cv && (
            <Tooltip title="View CV">
              <a className={Styles.btnView} href={`${uploadUrl}/uploads/applicants/${record.cv}`} target="_blank"><EyeOutlined /></a>
            </Tooltip>
          )}
          {ConfirmDeleteButton({
            onConfirm: () => handleDelete(record._id),
            tooltip: content['delete'],
            title: 'Confirm Deletion',
            okText: 'Yes',
            cancelText: 'No',
            description: 'Are you sure to delete this applicant?'
          })}
        </Space>
      )
    }
  ];

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មាន{content['applicants']}</h1>
        <CustomBreadcrumb items={[{ breadcrumbName: content['home'], path: '/' }, { breadcrumbName: content['applicants'] }]} />
      </div>

      <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <div className='flex flex-wrap gap-3'>
            <div>
              <Select allowClear placeholder={content['allStatus']} onChange={setStatusFilter} style={{ width: 160 }}>
                <Option value='applied'>Applied</Option>
                <Option value='shortlisted'>Shortlisted</Option>
                <Option value='test'>Test</Option>
                <Option value='interview'>Interview</Option>
                <Option value='hired'>Hired</Option>
                <Option value='reserve'>Reserve</Option>
                <Option value='rejected'>Rejected</Option>
              </Select>
            </div>
          </div>
          <div className='flex gap-3 mt-4 sm:mt-0'>
            <Input
              placeholder={content['searchAction']}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleCreate} className={Styles.btnCreate}>
              <PlusOutlined /> {`${content['create']} ${content['applicants']}`}
            </button>
          </div>
        </div>

        <Table
          className='custom-pagination custom-checkbox-table'
          columns={columns}
          dataSource={filteredApplicants}
          rowKey='_id'
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, size) => setPagination({ ...pagination, current: page, pageSize: size })
          }}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </Content>

      <TestAssignmentModal
        open={testModalData.visible}
        applicant={testModalData.applicant}
        onCancel={() => setTestModalData({ visible: false, applicant: null, jobAppId: null })}
        onSuccess={async () => {
          // ✅ Update status to 'test' after assignment
          try {
            await updateJobApplicationStatus(testModalData.jobAppId, 'test');
          } catch {
            message.error('Failed to update status to test');
          }

          setTestModalData({ visible: false, applicant: null, jobAppId: null });
          fetchApplicants();
        }}
      />

    </div>
  );
};

export default ApplicantPage;
