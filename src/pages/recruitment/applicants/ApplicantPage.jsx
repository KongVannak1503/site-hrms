import React, { useState, useEffect } from 'react';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Form, Input, Table, Tag, Select,
  Tooltip, Space, message,
  Modal,
  notification
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../../utils/CsStyle';
import {
  CloudDownloadOutlined,
  EyeOutlined, FormOutlined, PlusOutlined
} from '@ant-design/icons';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import {
  deleteApplicantApi,
  getApplicantsApi
} from '../../../services/applicantApi';
import uploadUrl, { handleDownload } from '../../../services/uploadApi';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import { updateJobApplicationStatus } from '../../../services/jobApplicationApi';
import TestAssignmentModal from '../tests/testAssignmentModal';
import InterviewModal from '../interviews/InterviewModal';
import dayjs from 'dayjs';
import showCustomConfirm from '../../../utils/showCustomConfirm';
import { cancelTestAssignmentApi } from '../../../services/testAssignmentService';
import { updateInterviewDecisionApi } from '../../../services/interviewApi';

const { Option } = Select;

const ApplicantPage = () => {
  const { isLoading, content, language } = useAuth();
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

  const [interviewModalData, setInterviewModalData] = useState({
    visible: false,
    applicant: null,
    jobAppId: null
  });

  useEffect(() => {
    document.title = `${content['applicants']} | USEA`
    fetchApplicants();
  }, [content]);

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
    test: ['interview', 'rejected'],
    interview: ['hired', 'reserve', 'rejected'],
    hired: [],
    reserve: [],
    rejected: [],
  };

  const handleStatusChange = async (jobAppId, newStatus, oldStatus, applicantData) => {
    const confirmLabel = content['yes'] || 'Yes';
    const cancelLabel = content['no'] || 'No';

    if (!validTransitions[oldStatus]?.includes(newStatus)) {
      message.warning(`Cannot change status from ${oldStatus} to ${newStatus}`);
      return;
    }

    // ✅ Reject from test or interview
    if (['test', 'interview'].includes(oldStatus) && newStatus === 'rejected') {
      const stageLabel = oldStatus === 'test' ? 'Test Stage' : 'Interview Stage';

      showCustomConfirm({
        title: `Reject Applicant (${stageLabel})`,
        content: `Are you sure you want to reject this applicant from the ${stageLabel}?`,
        okButton: (
          <button
            onClick={async () => {
              try {
                await updateJobApplicationStatus(jobAppId, newStatus);

                if (oldStatus === 'test' && applicantData.test_assignment_id) {
                  await cancelTestAssignmentApi(applicantData.test_assignment_id);
                }

                if (oldStatus === 'interview' && applicantData.interview_id) {
                  await updateInterviewDecisionApi(applicantData.interview_id, 'rejected');
                }

                notification.success({
                  message: 'Applicant Rejected',
                  description: `The applicant was rejected from ${stageLabel}.`,
                  placement: 'topRight'
                });

                fetchApplicants();
                Modal.destroyAll();
              } catch {
                notification.error({
                  message: 'Update Failed',
                  description: `Failed to reject applicant from ${stageLabel}.`,
                  placement: 'topRight'
                });
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        ),
        cancelButton: (
          <button
            onClick={() => Modal.destroyAll()}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            {cancelLabel}
          </button>
        )
      });

      return;
    }

    // ✅ Final decision from interview (hired/reserve)
    if (oldStatus === 'interview' && ['hired', 'reserve'].includes(newStatus)) {
      if (applicantData.interview_status !== 'completed') {
        message.warning('Cannot finalize decision until the interview is marked as completed.');
        return;
      }

      showCustomConfirm({
        title: `Confirm ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        content: `Are you sure you want to mark this applicant as ${newStatus}?`,
        okButton: (
          <button
            onClick={async () => {
              try {
                await updateJobApplicationStatus(jobAppId, newStatus);
                if (applicantData.interview_id) {
                  await updateInterviewDecisionApi(applicantData.interview_id, newStatus);
                }

                message.success(`Status updated to ${newStatus}`);
                fetchApplicants();
                Modal.destroyAll();
              } catch {
                message.error(`Failed to update status to ${newStatus}`);
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {confirmLabel}
          </button>
        ),
        cancelButton: (
          <button
            onClick={() => Modal.destroyAll()}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            {cancelLabel}
          </button>
        )
      });

      return;
    }

    // ✅ Shortlisted from applied
    if (oldStatus === 'applied' && newStatus === 'shortlisted') {
      showCustomConfirm({
        title: 'Confirm Shortlisting',
        content: 'Are you sure you want to mark this applicant as Shortlisted?',
        okButton: (
          <button
            onClick={async () => {
              try {
                await updateJobApplicationStatus(jobAppId, newStatus);
                message.success('Status updated to Shortlisted');
                fetchApplicants();
                Modal.destroyAll();
              } catch {
                message.error('Failed to update status');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {confirmLabel}
          </button>
        ),
        cancelButton: (
          <button
            onClick={() => Modal.destroyAll()}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            {cancelLabel}
          </button>
        )
      });

      return;
    }

    // ✅ Move to test: open test assignment modal
    if (oldStatus === 'shortlisted' && newStatus === 'test') {
      setTestModalData({
        visible: true,
        jobAppId,
        applicant: {
          ...applicantData,
          job_id: applicantData.job_application_id?.job_id || applicantData.job_id,
        },
      });
      return;
    }

    // ✅ Move to interview: only if test is completed
    if (oldStatus === 'test' && newStatus === 'interview') {
      if (applicantData.test_assignment_status !== 'completed') {
        message.warning('Cannot move to interview before completing the test.');
        return;
      }

      setInterviewModalData({
        visible: true,
        jobAppId,
        applicant: {
          ...applicantData,
          job_id: applicantData.job_application_id?.job_id || applicantData.job_id,
        },
        job: applicantData.job_application_id?.job_id || applicantData.job_id,
      });

      return;
    }

    // ✅ Fallback: directly update if no special handling needed
    try {
      await updateJobApplicationStatus(jobAppId, newStatus);
      message.success(`Status updated to ${newStatus}`);
      fetchApplicants();
    } catch {
      message.error('Failed to update status');
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
      title: `${content['fullName']}`,
      dataIndex: 'full_name_kh',
      render: (_, text) => <strong>{language == 'khmer' ? text?.full_name_kh : text?.full_name_en}</strong>,
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
      title: content['appliedDate'] || 'Applied Date',
      dataIndex: 'applied_date',
      render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '-'
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
          {record.cv && (
            <Tooltip title={content['download']}>
              <button
                className={Styles.btnDownload}
                onClick={() =>
                  handleDownload(`uploads/applicants/${encodeURIComponent(record.cv)}`, record.cv)
                }
              >
                <CloudDownloadOutlined />
              </button>
            </Tooltip>
          )}

          <Tooltip title={content['view']}>
            <button
              className={Styles.btnView}
              onClick={() => navigate(`/applicants/view/${record._id}`)}
            >
              <EyeOutlined />
            </button>
          </Tooltip>

          <Tooltip title={content['edit']}>
            <button className={Styles.btnEdit} onClick={() => handleUpdate(record._id)}><FormOutlined /></button>
          </Tooltip>

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
        <h1 className='text-xl font-extrabold text-[#002060]'><FileTextOutlined className='mr-2' />{content['informationKh']}{content['applicants']}</h1>
        <CustomBreadcrumb items={[{ breadcrumbName: content['home'], path: '/' }, { breadcrumbName: content['applicants'] }]} />
      </div>

      <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <div className='flex gap-3'>
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
            <Input
              placeholder={content['searchAction']}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className='flex gap-3 mt-4 sm:mt-0'>

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
            showTotal: (total, range) => `${range[0]}-${range[1]} ${content['of']} ${total} ${content['items']}`,
            locale: {
              items_per_page: content['page'],
            },
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

      <InterviewModal
        open={interviewModalData.visible}
        applicant={interviewModalData.applicant}
        job={interviewModalData.job}
        onCancel={() => setInterviewModalData({ visible: false, applicant: null, jobAppId: null })}
        onSuccess={async () => {
          try {
            await updateJobApplicationStatus(interviewModalData.jobAppId, 'interview');
          } catch {
            message.error('Failed to update status to interview');
          }
          setInterviewModalData({ visible: false, applicant: null, jobAppId: null });
          fetchApplicants();
        }}
      />

    </div>
  );
};

export default ApplicantPage;
