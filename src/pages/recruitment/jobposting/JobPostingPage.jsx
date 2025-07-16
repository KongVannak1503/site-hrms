import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Button, Drawer, message, Tooltip, Space, DatePicker } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { useAuth } from '../../../contexts/AuthContext';
import { getJobPostingsApi, deleteJobPostingApi, updateJobPostingStatusApi } from '../../../services/jobPosting';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { Styles } from '../../../utils/CsStyle';
import { Content } from 'antd/es/layout/layout';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import uploadUrl from '../../../services/uploadApi';

const { Option } = Select;

const JobPostingPage = () => {
    const { isLoading, content } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const { RangePicker } = DatePicker;

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['jobPosting'] }
    ];

    useEffect(() => {
        const fetchJobs = async () => {
        try {
            const res = await getJobPostingsApi();
            setJobs(res);
            setFilteredJobs(res);
        } catch (err) {
            message.error('Failed to fetch job postings');
        }
        };
        fetchJobs();
    }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = jobs.filter(job =>
      job.job_title?.toLowerCase().includes(value.toLowerCase()) ||
      job.department?.title?.toLowerCase().includes(value.toLowerCase()) ||
      job.position?.title?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateJobPostingStatusApi(id, newStatus);
      const updatedList = jobs.map(job =>
        job._id === id ? { ...job, status: updated.job.status } : job
      );
      setJobs(updatedList);
      setFilteredJobs(updatedList.filter(job =>
        job.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      message.success('Status updated');
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobPostingApi(id);
      const updated = jobs.filter(job => job._id !== id);
      setJobs(updated);
      setFilteredJobs(updated.filter(job =>
        job.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      message.success('Deleted successfully');
    } catch (err) {
      message.error('Failed to delete');
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setViewDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setViewDrawerVisible(false);
    setSelectedJob(null);
  };

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'job_title',
      key: 'job_title',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Department',
      dataIndex: ['department', 'title'],
      key: 'department',
    },
    {
      title: 'Position',
      dataIndex: ['position', 'title'],
      key: 'position',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity_available',
        key: 'quantity',
        render: (qty) => <span className="font-semibold">{qty}</span>,
    },
    // {
    //     title: 'Applicants',
    //     key: 'applicants',
    //     render: (_, record) => {
    //         const candidates = record.candidates || [];
    //         return (
    //         <div className="flex items-center gap-2">
    //             <div className="flex -space-x-2">
    //             {candidates.slice(0, 3).map((candidate, index) => {
    //                 const avatarUrl = candidate.avatar
    //                 ? `${uploadUrl}/uploads/applicants/${candidate.avatar}`
    //                 : null;
    //                 return (
    //                 <Tooltip key={index} title={candidate.name}>
    //                     <img
    //                         src={avatarUrl}
    //                         alt={candidate.name}
    //                         className="w-10 h-10 rounded-full border border-white shadow-sm"
    //                         onError={(e) => (e.target.style.display = 'none')}
    //                     />
    //                 </Tooltip>
    //                 );
    //             })}
    //             </div>
    //             <span className="text-sm font-semibold text-gray-700">
    //                 {record.candidates_count || 0}
    //             </span>
    //         </div>
    //         );
    //     },
    // },
    {
      title: 'Job Type',
      dataIndex: ['job_type', 'title'],
      key: 'job_type',
    },
    {
      title: 'Open Date',
      dataIndex: 'open_date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Close Date',
      dataIndex: 'close_date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
            <Option value="Draft">
                <span>
                    <span
                        style={{
                        height: 10,
                        width: 10,
                        backgroundColor: 'orange',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginRight: 8,
                        }}
                    />
                    Draft
                </span>
            </Option>
            <Option value="Open">
                <span>
                    <span
                        style={{
                        height: 10,
                        width: 10,
                        backgroundColor: 'green',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginRight: 8,
                        }}
                    />
                    Open
                </span>
            </Option>
            <Option value="Close">
                <span>
                    <span
                        style={{
                        height: 10,
                        width: 10,
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginRight: 8,
                        }}
                    />
                    Close
                </span>
            </Option>
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title={content['view']}>
                <button className={Styles.btnView} onClick={() => handleView(record)}>
                    <EyeOutlined />
                </button>
            </Tooltip>

            <Tooltip title={content['edit']}>
                <button className={Styles.btnEdit} onClick={() => navigate(`/job-postings/edit/${record._id}`)} >
                    <FormOutlined />
                </button>
            </Tooltip>

            {ConfirmDeleteButton({
                onConfirm: () => handleDelete(record._id),
                tooltip: content['delete'],
                title: content['confirmDelete'],
                okText: content['yes'],
                cancelText: content['no'],
                description: `${content['areYouSureToDelete']} ${record.name || 'this item'}?`
            })}
        </Space>
      )
    }
  ];

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>
          ព័ត៌មាន{content['jobPosting']}
        </h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

    <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
            <div className='flex flex-wrap gap-4 items-end'>
              {/* Duration filter */}
              <div className='flex flex-col'>
                <label className='text-sm text-gray-500 font-semibold mb-1.5'>Duration</label>
                <RangePicker
                  format="YYYY-MM-DD"
                  onChange={(dates) => {
                    if (dates) {
                      const [start, end] = dates;
                      const filtered = jobs.filter(job => {
                        const open = dayjs(job.open_date);
                        return open.isAfter(start) && open.isBefore(end);
                      });
                      setFilteredJobs(filtered);
                    } else {
                      setFilteredJobs(jobs);
                    }
                  }}
                />
              </div>

              {/* Department filter */}
              <div className='flex flex-col'>
                <label className='text-sm text-gray-500 font-semibold mb-1.5'>Department</label>
                <Select
                  placeholder="All Departments"
                  allowClear
                  style={{ minWidth: 150 }}
                  onChange={(value) => {
                    const filtered = jobs.filter(job =>
                      value ? job.department?._id === value : true
                    );
                    setFilteredJobs(filtered);
                  }}
                >
                  {[...new Set(jobs.map(job => job.department?._id))].map(id => {
                    const dept = jobs.find(j => j.department?._id === id)?.department;
                    return (
                      <Option key={id} value={id}>
                        {dept?.title}
                      </Option>
                    );
                  })}
                </Select>
              </div>

              {/* Status filter */}
              <div className='flex flex-col'>
                <label className='text-sm text-gray-500 font-semibold mb-1.5'>Status</label>
                <Select
                  placeholder="All Status"
                  allowClear
                  style={{ minWidth: 120 }}
                  onChange={(status) => {
                    const filtered = jobs.filter(job =>
                      status ? job.status === status : true
                    );
                    setFilteredJobs(filtered);
                  }}
                >
                  <Option value="Draft">Draft</Option>
                  <Option value="Open">Open</Option>
                  <Option value="Close">Close</Option>
                </Select>
              </div>
            </div>

            <div className='flex gap-3 mt-4 sm:mt-0'>
                <Input
                    placeholder={content['searchAction']}
                    allowClear
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button onClick={() => navigate('/job-postings/create')} className={Styles.btnCreate}>
                    <PlusOutlined /> {`${content['create']} ${content['jobPosting']}`}
                </button>
            </div>
        </div>
    
      <Table
        className='custom-pagination custom-checkbox-table'
        columns={columns}
        scroll={{ x: 'max-content' }}
        dataSource={filteredJobs}
        rowKey="_id"
        pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} ${content['of']} ${total} ${content['items']}`,
            onChange: (page, pageSize) => {
                setPagination({
                    ...pagination,
                    current: page,
                    pageSize: pageSize,
                });
            }
        }}
      />
    </Content>

      {/* Drawer for View */}
      <Drawer
        title={
          <div className="text-xl font-bold text-[#17a2b8]">
            {selectedJob?.job_title} - {selectedJob?.department?.title}
          </div>
        }
        placement="right"
        width={700}
        onClose={handleCloseDrawer}
        open={viewDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }} // for spacing below
      >
        {selectedJob && (
          <div className="grid grid-cols-1 gap-6">
            {/* Meta Info Section */}
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Position:</strong> <span>{selectedJob.position?.title || '-'}</span></div>
              <div><strong>Job Type:</strong> <span>{selectedJob.job_type?.title || '-'}</span></div>

              <div><strong>Quantity:</strong> <span>{selectedJob.quantity_available || '-'}</span></div>
              <div><strong>Status:</strong> <span>{selectedJob.status || '-'}</span></div>

              <div><strong>Open Date:</strong> <span>{dayjs(selectedJob.open_date).format('YYYY-MM-DD')}</span></div>
              <div><strong>Close Date:</strong> <span>{dayjs(selectedJob.close_date).format('YYYY-MM-DD')}</span></div>
            </div>

            {/* Divider */}
            <div className="border-t pt-2">
              <div className="mb-3">
                <strong>Responsibilities:</strong>
                <div className="prose max-w-none mt-2 border p-3 bg-gray-50 rounded-md" 
                    dangerouslySetInnerHTML={{ __html: selectedJob.responsibilities || '<p>-</p>' }} />
              </div>

              <div className="mt-4">
                <strong>Requirements:</strong>
                <div className="prose max-w-none mt-2 border p-3 bg-gray-50 rounded-md"
                    dangerouslySetInnerHTML={{ __html: selectedJob.requirements || '<p>-</p>' }} />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default JobPostingPage;
