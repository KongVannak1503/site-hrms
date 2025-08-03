import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Button, Dropdown, message, Card, Table, Avatar, Tooltip, Space, Form, Col, Row, DatePicker, Select, Input, Modal, notification } from 'antd';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EllipsisOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';
import { FaList, FaRegCalendar } from "react-icons/fa6";
import {
  getAllTestAssignmentsApi,
  cancelTestAssignmentApi
} from '../../../services/testAssignmentService';
import dayjs from 'dayjs';
import EditTestAssignmentModal from './EditTestAssignmentModal';
import RescheduleTestModal from './RescheduleModal';
import { Styles } from '../../../utils/CsStyle';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import TestDetailPage from './TestDetailPage';
import uploadUrl from '../../../services/uploadApi';
import TestAssignmentModal from './TestAssignmentModal';
import showCustomConfirm from '../../../utils/showCustomConfirm';
import InterviewModal from '../interviews/InterviewModal';
import { getAllInterviewsApi } from '../../../services/interviewApi';

const TestSchedulePage = () => {
  const { isLoading, content } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalData, setEditModalData] = useState({ visible: false, assignment: null });
  const [rescheduleModalData, setRescheduleModalData] = useState({ visible: false, assignment: null });
  const [detailModalData, setDetailModalData] = useState({ visible: false, assignmentId: null, refresh: null });
  const [viewMode, setViewMode] = useState('calendar');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [tableData, setTableData] = useState([]);

  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const [filters, setFilters] = useState({
    keyword: '',
    status: null,
    dateRange: null
  });
  const [rawData, setRawData] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [interviewModalData, setInterviewModalData] = useState({
    visible: false,
    applicant: null,
    job: null
  });


  const openDetailModal = (assignmentId) => {
    setDetailModalData({
      visible: true,
      assignmentId,
      refresh: Date.now() 
    });
  };

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['testSchedule'] }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    if (rawData.length > 0) {
      const filtered = applyFilters(rawData);
      setTableData(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length }));
    }
  }, [filters, rawData]);

  const fetchEvents = async () => {
    try {
      const data = await getAllTestAssignmentsApi();

      const today = new Date();

       const formatted = data.map(item => {
        const title = `${item?.applicant_id?.full_name_en || 'Unknown'} - ${
          item?.test_type_scores?.map(t => t.test_type?.name_en).join(', ')
        }`;

        return {
          id: item._id,
          title,
          start: item.start_at,
          color: item.status === 'rejected' ? '#e3342f' : undefined,
          extendedProps: {
            applicant: item.applicant_id,
            test_type_scores: item.test_type_scores,
            location: item.location,
            duration: item.duration_min,
            job: item.job_id?.job_title,
            status: item.status,
          }
        };
      });

      setEvents(formatted);

      const todayTest = formatted.find(e => {
        const d = new Date(e.start);
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear() &&
          e.extendedProps.status !== 'rejected'
        );
      });

      if (todayTest) setSelectedEvent(todayTest);

    } catch (err) {
      message.error('Failed to load test schedules');
    }
  };

  const fetchTableData = async () => {
    try {
      const testData = await getAllTestAssignmentsApi();

      const interviewData = await getAllInterviewsApi();
      // console.log("✅ Interviews:", interviewData);

      const interviewMap = new Map();
      interviewData.forEach(interview => {
        const applicantId = interview.applicant_id?._id || interview.applicant_id;
        const jobId = interview.job_id?._id || interview.job_id;

        if (applicantId && jobId) {
          const key = `${applicantId}_${jobId}`;
          interviewMap.set(key, true);
        } else {
          console.warn('❗ Missing applicant_id or job_id in interview:', interview);
        }
      });


      const formatted = testData.map(item => {
        const applicantId = item.applicant_id?._id || item.applicant_id;
        const jobId = item.job_id?._id || item.job_id;
        const key = `${applicantId}_${jobId}`;
        const hasInterview = interviewMap.has(key);

        return {
          _id: item._id,
          applicant_id: item.applicant_id,
          test_type_scores: item.test_type_scores,
          photo: item.applicant_id?.photo,
          full_name_kh: item.applicant_id?.full_name_kh,
          full_name_en: item.applicant_id?.full_name_en,
          gender: item.applicant_id?.gender,
          phone_no: item.applicant_id?.phone_no,
          email: item.applicant_id?.email,
          job_id: item.job_id,
          job_title: item.job_id?.job_title,
          test_types: item.test_type_scores?.map(t => t.test_type?.name_en).join(', '),
          start_at: item.start_at,
          duration_min: item.duration_min,
          location: item.location,
          status: item.status,
          average_score: item.average_score,
          attachment: item.attachment || null,
          has_interview: hasInterview
        };
      });

      setRawData(formatted);
      setTableData(applyFilters(formatted));
      setPagination(prev => ({ ...prev, total: formatted.length }));
    } catch (err) {
      console.error("❌ Error in fetchTableData:", err);
      message.error('Failed to load table data');
    }
  };

  const applyFilters = (data) => {
    return data.filter(item => {
      const matchesKeyword = filters.keyword
        ? (item.full_name_en?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          item.job_title?.toLowerCase().includes(filters.keyword.toLowerCase()))
        : true;

      const matchesStatus = filters.status
        ? item.status === filters.status
        : true;

      const matchesDate = filters.dateRange
        ? (
            dayjs(item.start_at).isSameOrAfter(dayjs(filters.dateRange[0]), 'day') &&
            dayjs(item.start_at).isSameOrBefore(dayjs(filters.dateRange[1]), 'day')
          )
        : true;

      return matchesKeyword && matchesStatus && matchesDate;
    });
  };

  const handleFilterChange = (changedValues, allValues) => {
    setFilters(allValues);
  };

  const handleRefreshAll = () => {
    fetchEvents();
    fetchTableData();
  };


  const handleEventClick = ({ event }) => {
    const status = event.extendedProps?.status;
    if (status === 'rejected') {
      return;
    }
    openDetailModal(event.id);
  };

  const handleReject = async (id) => {
    showCustomConfirm({
      title: 'Confirm Rejection',
      content: 'Are you sure you want to reject this applicant?',
      okButton: (
        <button
          onClick={async () => {
            try {
              await cancelTestAssignmentApi(id);
              notification.success({
                message: 'Test Cancelled',
                description: 'The selected test assignment has been successfully cancelled.',
                placement: 'topRight',
              });
              handleRefreshAll();
              Modal.destroyAll(); // close manually
            } catch {
              notification.error({
                message: 'Cancellation Failed',
                description: 'Something went wrong while trying to cancel the test.',
                placement: 'topRight',
              });
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
        >
          Yes
        </button>
      ),
      cancelButton: (
        <button
          onClick={() => Modal.destroyAll()}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
        >
          No
        </button>
      )
    });
  };

  const normalizeAssignmentData = (data) => {
    const isCalendarEvent = !!data.extendedProps;

    const applicant = isCalendarEvent
      ? data.extendedProps?.applicant
      : data.applicant_id || {};

    const test_type_scores = isCalendarEvent
      ? data.extendedProps?.test_type_scores?.map(t => ({
          test_type: t.test_type?._id || t.test_type, // normalize to string ID
          score: t.score || 0
        }))
      : data.test_type_scores?.map(t => ({
          test_type: t.test_type?._id || t.test_type,
          score: t.score || 0
        })) || [];

    return {
      id: data.id || data._id,
      start: isCalendarEvent ? data.start : data.start_at,
      extendedProps: {
        applicant,
        test_type_scores,
        duration: isCalendarEvent ? data.extendedProps?.duration : data.duration_min,
        location: isCalendarEvent ? data.extendedProps?.location : data.location
      }
    };
  };

  const handleEdit = (data) => {
    const assignment = normalizeAssignmentData(data);
    setEditModalData({ visible: true, assignment });
    console.log('Edit Modal Input:', normalizeAssignmentData(data));
  };

  const handleReschedule = (data) => {
    const assignment = normalizeAssignmentData(data);
    setRescheduleModalData({ visible: true, assignment });
  };

  const todayTests = events.filter(ev =>
    dayjs(ev.start).isSame(dayjs(), 'day')
  );

  const handleMoveToInterview = (record) => {
    setInterviewModalData({
      visible: true,
      applicant: record.applicant_id,
      job: record.job_id
    });
  };


  const columns = [
    {
      title: content['applicantName'],
      key: 'applicant_info',
      render: (_, record) => (
        <div className="flex gap-3 items-center">
          <Avatar
            size={50}
            src={
              record.photo
                ? `${uploadUrl}/uploads/applicants/${encodeURIComponent(record.photo)}`
                : undefined
            }
          />
          <div>
            <div className="font-semibold text-gray-800">{record.full_name_kh || 'Unknown'}</div>
            <div className="text-sm text-gray-500">{record.job_title || '—'}</div>
          </div>
        </div>
      )
    },
    {
      title: content['testType'],
      dataIndex: 'test_types',
    },
    {
      title: content['startOn'],
      dataIndex: 'start_at',
      render: val => dayjs(val).format('DD-MM-YYYY hh:mm A')
    },
    {
      title: content['duration'],
      dataIndex: 'duration_min',
    },
    {
      title: content['location'],
      dataIndex: 'location',
    },
    {
      title: content['averageScore'],
      dataIndex: 'average_score',
      render: (score) => {
        if (score == null) return '-';
        const color = score < 50 ? 'red' : "green";

        return (
          <span className={`text-${color}-600 font-semibold`}>
            {score}
          </span>
        );
      }
    },
    {
      title: content['attactFile'],
      dataIndex: 'attachment',
      render: (file) =>
        file ? (
          <a
            href={`${uploadUrl}/uploads/test-assignments/${encodeURIComponent(file)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip title="View File">
              <PaperClipOutlined style={{ fontSize: 18 }} />
            </Tooltip>
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: content['status'],
      dataIndex: 'status',
      render: status => {
        const colorMap = {
          scheduled: 'yellow',
          completed: 'green',
          rejected: 'red'
        };
        const capitalized = status.charAt(0).toUpperCase() + status.slice(1);
        return <span className={`text-${colorMap[status] || 'gray'}-600 font-semibold`}>{capitalized}</span>
      }
    },
    {
      title: content['action'],
      key: 'action',
      align: 'center',
      render: (_, record) => {
        if (record.status === 'rejected') {
          return (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-400 italic">Rejected</span>
            </div>
          );
        }

        const canScheduleInterview = record.status === 'completed' && !record.has_interview;

        return (
          <div className="flex justify-center items-center gap-2 h-full">
            {/* ✅ Interview Button or ✔ Icon */}
            {record.has_interview ? (
              <Tooltip>
                <span className="text-green-600 text-lg font-bold">✔</span>
              </Tooltip>
            ) : (
              <Tooltip>
                <button
                  className={`${Styles.btnSecondary} ${
                    !canScheduleInterview ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!canScheduleInterview}
                  onClick={() => {
                    if (canScheduleInterview) handleMoveToInterview(record);
                  }}
                >
                  Interview
                </button>
              </Tooltip>
            )}

            {/* ✅ Dropdown Actions */}
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'view',
                    label: (
                      <div onClick={() => openDetailModal(record._id)} className="flex items-center gap-2 cursor-pointer">
                        {content['view']} View
                      </div>
                    )
                  },
                  {
                    key: 'edit',
                    label: <div onClick={() => handleEdit(record)}>Edit</div>
                  },
                  {
                    key: 'reschedule',
                    label: <div onClick={() => handleReschedule(record)}>Reschedule</div>
                  },
                  {
                    key: 'reject',
                    label: (
                      <span onClick={() => handleReject(record._id)} className="text-red-500">
                        Rejected
                      </span>
                    )
                  }
                ]
              }}
            >
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        );
      }
    }
  ];

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មាន{content['testSchedule']}</h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
          <div className='flex flex-col sm:flex-row justify-between items-center w-full'>
            {/* View Mode Toggle */}
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-black text-white' : 'bg-white text-gray-800'
                }`}
              >
                <FaRegCalendar />
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  viewMode === 'table' ? 'bg-black text-white' : 'bg-white text-gray-800'
                }`}
              >
                <FaList />
              </button>
            </div>

            <div className='flex items-center gap-3 mt-4 sm:mt-0'>
              <button 
                className={Styles.btnCreate}
                onClick={() => {
                  setSelectedApplicant(null); // reset previous
                  setCreateModalVisible(true);
                }}
              >
                  <PlusOutlined /> {`${content['create']} ${content['testSchedule']}`}
              </button>
            </div>
          </div>
        </Content>
      </div>
      
      <div className='mt-4'>
        {viewMode === 'calendar' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-3/4 bg-white p-4 rounded-md shadow">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev today next',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                contentHeight="auto"
              />
            </div>

            <div className="w-full lg:w-1/4">
              {selectedEvent ? (
                <Card className="shadow" title="Test Schedule">
                  {todayTests.length === 0 ? (
                    <p>No test scheduled today.</p>
                  ) : (
                    todayTests.map((selectedEvent, index) => (
                      <div 
                        key={selectedEvent.id} 
                        className="mb-4 pb-4 border-b border-b-gray-300 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="border rounded text-center px-2 py-1 w-12">
                              <div className="text-xs text-gray-700">
                                {dayjs(selectedEvent.start).format('MMM')}
                              </div>
                              <div className="text-lg font-bold">
                                {dayjs(selectedEvent.start).format('DD')}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-base font-semibold">
                                {selectedEvent.extendedProps.applicant?.full_name_en || 'Unnamed Applicant'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1.5">
                                {dayjs(selectedEvent.start).format('DD-MM-YYYY , hh:mm a')}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedEvent.extendedProps.job || '—'}
                              </p>
                            </div>
                          </div>

                          <Dropdown
                            placement="bottomRight"
                            menu={{
                              items: [
                                {
                                  key: 'edit',
                                  label: <span>Edit</span>,
                                  onClick: () => setEditModalData({ visible: true, assignment: selectedEvent })
                                },
                                {
                                  key: 'reschedule',
                                  label: <span>Reschedule</span>,
                                  onClick: () => setRescheduleModalData({ visible: true, assignment: selectedEvent })
                                },
                                {
                                  key: 'reject',
                                  label: <span className="text-red-500">Rejected</span>,
                                  onClick: () => handleReject(selectedEvent.id)
                                }
                              ]
                            }}
                            trigger={['click']}
                          >
                            <Button icon={<EllipsisOutlined />} type="text" />
                          </Dropdown>
                        </div>
                      </div>
                    ))
                  )}
                </Card>
              ) : (
                <Card title="Test Schedule" className="shadow">
                  <p>No test scheduled today.</p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md shadow">
            <Form
              layout="vertical"
              onValuesChange={handleFilterChange}
              initialValues={filters}
            >
              <Row gutter={16} className="mb-4">
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                  <Row gutter={16}>
                    <Col span={4}>
                      <Form.Item name="status" >
                        <Select allowClear placeholder="Select status">
                          <Option value="scheduled">Scheduled</Option>
                          <Option value="completed">Completed</Option>
                          <Option value="rejected">Rejected</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item name="dateRange">
                        <RangePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                  <Form.Item name="keyword">
                    <Input.Search placeholder="Search by name or job title" allowClear />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            
            <Table 
              className='custom-pagination custom-checkbox-table'
              loading={isLoading}
              scroll={{ x: 'max-content' }}
              dataSource={tableData}
              rowKey={(record) => record._id}
              columns={columns}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, size) => setPagination({ ...pagination, current: page, pageSize: size })
              }}
            />
          </div>
        )}
      </div>

      <EditTestAssignmentModal
        open={editModalData.visible}
        testAssignment={editModalData.assignment}
        onCancel={() => setEditModalData({ visible: false, assignment: null })}
        onSuccess={() => {
          setEditModalData({ visible: false, assignment: null });
          handleRefreshAll();
        }}
      />

      <RescheduleTestModal
        open={rescheduleModalData.visible}
        assignment={rescheduleModalData.assignment}
        onCancel={() => setRescheduleModalData({ visible: false, assignment: null })}
        onSuccess={() => {
          setRescheduleModalData({ visible: false, assignment: null });
          handleRefreshAll();
        }}
      />

      <TestDetailPage
        open={detailModalData.visible}
        assignmentId={detailModalData.assignmentId}
        refresh={detailModalData.refresh}
        onClose={() => {
          setDetailModalData({ visible: false, assignmentId: null });
          handleRefreshAll();
        }}
      />

      <TestAssignmentModal
        open={createModalVisible}
        applicant={selectedApplicant}
        onCancel={() => {
          setCreateModalVisible(false);
          setSelectedApplicant(null);
        }}
        onSuccess={() => {
          setCreateModalVisible(false);
          setSelectedApplicant(null);
          handleRefreshAll();
        }}
      />

      <InterviewModal
        open={interviewModalData.visible}
        applicant={interviewModalData.applicant}
        job={interviewModalData.job}
        onCancel={() => setInterviewModalData({ visible: false, applicant: null, job: null })}
        onSuccess={() => {
          setInterviewModalData({ visible: false, applicant: null, job: null });
          handleRefreshAll(); // Refresh data
        }}
      />

    </div>
  );
};

export default TestSchedulePage;
