import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Content } from 'antd/es/layout/layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Avatar, Button, Card, Col, DatePicker, Dropdown, Form, Input, message, Modal, notification, Row, Select, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { getAllInterviewsApi, updateInterviewDecisionApi } from '../../../services/interviewApi';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { FaList, FaRegCalendar } from 'react-icons/fa6';
import { EllipsisOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import uploadUrl from '../../../services/uploadApi';
import EditInterviewModal from './EditInterviewModal';
import RescheduleModal from './InterviewRescheduleModal';
import InterviewResultModal from './InterviewResultModal';
import DateDisplayBox from '../../../utils/DateDisplayBox';
import { Styles } from '../../../utils/CsStyle';
import { getAllTestAssignmentsApi } from '../../../services/testAssignmentService';
import InterviewModal from './InterviewModal';
import showCustomConfirm from '../../../utils/showCustomConfirm';

const InterviewPage = () => {
  const { isLoading, content, identity } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({
    status: null,
    dateRange: null,
    keyword: ''
  });
  const [editModalData, setEditModalData] = useState({
    visible: false,
    interview: null
  });
  const [interviews, setInterviews] = useState([]);
  const [rescheduleModalData, setRescheduleModalData] = useState({
    visible: false,
    interview: null
  });
  const [resultModalData, setResultModalData] = useState({
    visible: false,
    interview: null
  });

  const [interviewModalData, setInterviewModalData] = useState({
    visible: false,
    applicant: null,
    job: null
  });

  const [loadingEligible, setLoadingEligible] = useState(false);
  const [eligibleApplicants, setEligibleApplicants] = useState([]);

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: `${content['informationKh']}${content['interviewSchedule']}` }
  ];

  const employeePermission = identity?.role?.permissions?.find(
    p => p.permissionId?.name === "job-postings"
  );

  // fallback empty array if not found
  const allowedActions = employeePermission?.actions || [];

  // convert into quick lookup map
  const permissionMap = allowedActions.reduce((acc, action) => {
    acc[action] = true;
    return acc;
  }, {});

  const todayTests = events.filter(ev =>
    dayjs(ev.start).isSame(dayjs(), 'day')
  );

  useEffect(() => {
    document.title = `${content['interviewSchedule']} | USEA`
    fetchInterviews();
  }, [content]);

  const fetchInterviews = async () => {
    try {
      const data = await getAllInterviewsApi();
      setInterviews(data);

      const formattedEvents = data.map(item => ({
        id: item._id,
        title: `${item.applicant_id?.full_name_en || 'Unnamed'} - ${item.job_id?.job_title || 'No Title'
          }`,
        start: item.start_at,
        color: item.status === 'cancelled' ? '#e3342f' : undefined,
        extendedProps: {
          applicant: item.applicant_id,
          job: item.job_id?.job_title,
          location: item.location,
          duration: item.duration_min,
          status: item.status,
          interviewers: item.interviewers || [],
          interview_id: item._id,
          final_decision: item.final_decision,
        }
      }));

      setEvents(formattedEvents);

      // Default to first event today
      const today = dayjs();
      const todayEvent = formattedEvents.find(ev => dayjs(ev.start).isSame(today, 'day'));
      setSelectedEvent(todayEvent || null);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
    }
  };

  const filteredData = events.filter(event => {
    const { applicant, job, status } = event.extendedProps || {};
    const { dateRange, status: filterStatus, keyword } = filters;

    const matchesStatus = !filterStatus || status === filterStatus;

    const matchesDate = !dateRange || (
      dayjs(event.start).isSameOrAfter(dayjs(dateRange[0]), 'day') &&
      dayjs(event.start).isSameOrBefore(dayjs(dateRange[1]), 'day')
    );

    const matchesKeyword = !keyword || (
      applicant?.full_name_en?.toLowerCase().includes(keyword.toLowerCase()) ||
      job?.toLowerCase().includes(keyword.toLowerCase())
    );

    return matchesStatus && matchesDate && matchesKeyword;
  });

  const handleOpenApplicantSelector = async () => {
    try {
      setLoadingEligible(true);
      const tests = await getAllTestAssignmentsApi();
      const completedTests = tests.filter(t => t.status === 'completed');

      const interviewKeys = new Set(interviews.map(i => `${i.applicant_id?._id}_${i.job_id?._id}`));
      const eligible = completedTests.filter(t => {
        const key = `${t.applicant_id?._id}_${t.job_id?._id}`;
        return !interviewKeys.has(key);
      });

      setEligibleApplicants(eligible); // Can be empty ✅
      setInterviewModalData({ visible: true, applicant: null, job: null }); // Always show modal ✅
    } catch (err) {
      console.error('Failed to load eligible applicants', err);
      message.error('Failed to load eligible applicants');
    } finally {
      setLoadingEligible(false);
    }
  };

  const handleDecision = async (interviewId, decision) => {
    try {
      const decisionText = {
        hired: 'Hired',
        reserve: 'Reserve',
        rejected: 'Rejected'
      };

      showCustomConfirm({
        title: `Confirm ${decisionText[decision]}`,
        content: `Are you sure you want to mark this applicant as "${decisionText[decision]}"?`,
        okButton: (
          <button
            onClick={async () => {
              try {
                await updateInterviewDecisionApi(interviewId, decision);
                notification.success({
                  message: 'Decision Updated',
                  description: `Applicant has been marked as ${decisionText[decision]}.`,
                  placement: 'topRight'
                });
                fetchInterviews(); // refresh list
                Modal.destroyAll(); // manually close
              } catch (err) {
                console.error(`Failed to update decision:`, err);
                notification.error({
                  message: 'Update Failed',
                  description: `Failed to mark applicant as ${decisionText[decision]}.`,
                  placement: 'topRight'
                });
              }
            }}
            className={`px-4 py-2 rounded text-white cursor-pointer ${decision === 'hired'
              ? 'bg-green-600 hover:bg-green-700'
              : decision === 'reserve'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            {content['yes'] || 'Yes'}
          </button>
        ),
        cancelButton: (
          <button
            onClick={() => Modal.destroyAll()}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
          >
            {content['no'] || 'No'}
          </button>
        )
      });
    } catch (err) {
      console.error(`Failed to update decision:`, err);
      message.error(`Failed to mark as ${decision}`);
    }
  }

  const columns = [
    {
      title: content['applicantName'],
      key: 'applicant',
      render: (_, record) => {
        const applicant = record.extendedProps?.applicant;
        const jobTitle = record.extendedProps?.job;
        const photo = applicant?.photo;

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
              <span className="text-gray-500 text-xs">{jobTitle || '—'}</span>
            </div>
          </div>
        );
      }
    },
    {
      title: content['interviewer'],
      render: (_, record) => {
        const interviewers = record?.extendedProps?.interviewers || [];
        return (
          <div className="flex flex-wrap gap-1">
            {interviewers.map((i, idx) => (
              <Tag key={idx} color="blue">
                {i.employee?.first_name_en || '—'}
              </Tag>
            ))}
          </div>
        );
      }
    },
    {
      title: content['startOn'],
      dataIndex: 'start',
      render: (val) => dayjs(val).format('DD-MM-YYYY hh:mm A')
    },
    {
      title: content['duration'],
      dataIndex: ['extendedProps', 'duration'],
      render: (val) => `${val} min`
    },
    {
      title: content['location'],
      dataIndex: ['extendedProps', 'location'],
    },
    {
      title: content['averageScore'],
      render: (_, record) => {
        const interviewers = record?.extendedProps?.interviewers || [];
        const total = interviewers.reduce((sum, i) => sum + (i.score || 0), 0);
        const avg = interviewers.length ? (total / interviewers.length).toFixed(2) : null;

        let color = 'default';
        if (avg >= 80) color = 'green';
        else if (avg >= 50) color = 'gold';
        else if (avg > 0) color = 'red';

        return (
          <Tag color={color}>
            {avg !== null ? `${avg}` : '—'}
          </Tag>
        );
      }
    },
    {
      title: content['status'],
      dataIndex: ['extendedProps', 'status'],
      render: (status) => {
        const colorMap = {
          scheduled: 'blue',
          completed: 'green',
          cancelled: 'red'
        };
        return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>;
      }
    },
    {
      title: content['decision'],
      key: 'decision',
      align: 'center',
      render: (_, record) => {
        const status = record.extendedProps?.status;
        const decision = record.extendedProps?.final_decision;

        const colorMap = {
          hired: 'green',
          reserve: 'gold',
          rejected: 'red'
        };

        const labelMap = {
          hired: content['hired'] || 'Hired',
          reserve: content['reserve'] || 'Reserve',
          rejected: content['reject'] || 'Rejected'
        };

        // ✅ Show decision tag if already made
        if (decision) {
          return (
            <Tag color={colorMap[decision]} className="font-semibold">
              {labelMap[decision]}
            </Tag>
          );
        }

        // Pending if not completed yet
        if (status !== 'completed') {
          return <span className="text-gray-400 italic">Pending</span>;
        }

        // Show decision buttons
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleDecision(record.id, 'hired')}
              className="bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700 cursor-pointer"
            >
              {labelMap['hired']}
            </button>
            <button
              onClick={() => handleDecision(record.id, 'reserve')}
              className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 cursor-pointer"
            >
              {labelMap['reserve']}
            </button>
            <button
              onClick={() => handleDecision(record.id, 'rejected')}
              className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700 cursor-pointer"
            >
              {labelMap['rejected']}
            </button>
          </div>
        );
      }
    },
    {
      title: content['action'],
      render: (_, record) => (
        <Dropdown
          placement="bottomRight"
          menu={{
            items: [
              {
                key: 'view',
                label: <span>View</span>,
                onClick: () => {
                  const interview = interviews.find(i => i._id === record.id);
                  setResultModalData({ visible: true, interview });
                }
              },
              ...(permissionMap.update ? [{
                key: 'edit',
                label: <span>Edit</span>,
                onClick: () => {
                  const interview = interviews.find(i => i._id === record.id);
                  setEditModalData({ visible: true, interview });
                }
              }] : []),
              ...(permissionMap.update ? [{
                key: 'reschedule',
                label: <span>Reschedule</span>,
                onClick: () => {
                  const interview = interviews.find(i => i._id === record.id);
                  setRescheduleModalData({ visible: true, interview });
                }
              }] : []),

            ]
          }}
        >
          <Button icon={<EllipsisOutlined />} size="small" />
        </Dropdown>
      )
    }
  ];

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#002060]'> <FileTextOutlined className='mr-2' />{content['informationKh']}{content['interviewSchedule']}</h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
          <div className='flex flex-col sm:flex-row justify-between items-center w-full'>
            {/* View Mode Toggle */}
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm cursor-pointer ${viewMode === 'calendar' ? 'bg-black text-white' : 'bg-white text-gray-800'
                  }`}
              >
                <FaRegCalendar />
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm cursor-pointer ${viewMode === 'table' ? 'bg-black text-white' : 'bg-white text-gray-800'
                  }`}
              >
                <FaList />
              </button>
            </div>

            <div className='flex items-center gap-3 mt-4 sm:mt-0'>
              <button
                className={`${Styles.btnCreate} ${!permissionMap.create ? ' !cursor-not-allowed' : ' '}`}
                disabled={!permissionMap.create}
                onClick={() => handleOpenApplicantSelector()}
              >
                <PlusOutlined /> {`${content['create']} ${content['interviewSchedule']}`}
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
                eventClick={({ event }) => {
                  setSelectedEvent(event);

                  const interviewId = event.extendedProps?.interview_id;
                  const interview = interviews.find(i => i._id === interviewId);

                  if (interview) {
                    setResultModalData({ visible: true, interview });
                  }
                }}
                height="auto"
                contentHeight="auto"
              />
            </div>

            <div className="w-full lg:w-1/4">
              {selectedEvent ? (
                <Card title={content['interviewSchedule']} className="shadow">
                  {todayTests.length === 0 ? (
                    <p>No interivew scheduled today.</p>
                  ) : (
                    todayTests.map((selectedEvent, index) => (
                      <div
                        key={selectedEvent.id}
                        className="mb-4 pb-4 border-b border-b-gray-300 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            {/* <div className="border rounded text-center px-2 py-1 w-12">
                              <div className="text-xs text-gray-700">
                                {dayjs(selectedEvent.start).format('MMM')}
                              </div>
                              <div className="text-lg font-bold">
                                {dayjs(selectedEvent.start).format('DD')}
                              </div>
                            </div>  */}
                            <DateDisplayBox date={selectedEvent.start} />

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
                                  key: 'view',
                                  label: <span>View</span>,
                                  onClick: () => {
                                    const interviewId = selectedEvent.extendedProps.interview_id;
                                    const interview = interviews.find(i => i._id === interviewId);
                                    setResultModalData({ visible: true, interview });
                                  }
                                },
                                {
                                  key: 'edit',
                                  label: <span>Edit</span>,
                                  onClick: () => {
                                    const interviewId = selectedEvent.extendedProps.interview_id;
                                    const interview = interviews.find((i) => i._id === interviewId);
                                    setEditModalData({ visible: true, interview });
                                  }
                                },
                                {
                                  key: 'reschedule',
                                  label: <span>Reschedule</span>,
                                  onClick: () => {
                                    const interviewId = selectedEvent.extendedProps.interview_id;
                                    const interview = interviews.find(i => i._id === interviewId);
                                    setRescheduleModalData({ visible: true, interview });
                                  }
                                },
                                // {
                                //   key: 'delete',
                                //   label: <span className="text-red-500">Delete</span>,
                                //   onClick: () => handleDelete(selectedEvent.id)
                                // }
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
                <Card title={content['interviewSchedule']} className="shadow">
                  <p>No interview scheduled today.</p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md shadow mt-4">
            <Form
              layout="vertical"
              onValuesChange={(changed, all) => setFilters(all)}
              initialValues={filters}
            >
              <Row gutter={16} className="mb-4">
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item name="status">
                        <Select allowClear placeholder={content['allStatus']}>
                          <Select.Option value="scheduled">Scheduled</Select.Option>
                          <Select.Option value="completed">Completed</Select.Option>
                          <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={10}>
                      <Form.Item name="dateRange">
                        <DatePicker.RangePicker style={{ width: '100%' }} placeholder={[content['startDate'], content['endDate']]} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                  <Form.Item name="keyword">
                    <Input placeholder={content['searchAction']} allowClear />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Table
              className='custom-pagination custom-checkbox-table'
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) => record.id}
              scroll={{ x: 'max-content' }}
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
            />
          </div>
        )}

      </div>

      <InterviewModal
        open={interviewModalData.visible}
        eligibleApplicants={eligibleApplicants}
        onCancel={() => {
          setInterviewModalData({ visible: false, applicant: null, job: null });
          setEligibleApplicants([]);
        }}
        onSuccess={() => {
          setInterviewModalData({ visible: false, applicant: null, job: null });
          setEligibleApplicants([]);
          fetchInterviews(); // Refresh
        }}
      />

      <EditInterviewModal
        open={editModalData.visible}
        interview={editModalData.interview} // Must be full interview object
        onCancel={() => setEditModalData({ visible: false, interview: null })}
        onSuccess={() => {
          setEditModalData({ visible: false, interview: null });
          fetchInterviews(); // Refresh list after update
        }}
      />

      <RescheduleModal
        open={rescheduleModalData.visible}
        interview={rescheduleModalData.interview}
        onCancel={() => setRescheduleModalData({ visible: false, interview: null })}
        onSuccess={() => {
          setRescheduleModalData({ visible: false, interview: null });
          fetchInterviews(); // Refresh data
        }}
      />

      <InterviewResultModal
        open={resultModalData.visible}
        interview={resultModalData.interview}
        onCancel={() => setResultModalData({ visible: false, interview: null })}
        onSuccess={() => {
          setResultModalData({ visible: false, interview: null });
          fetchInterviews(); // Refresh data
        }}
      />

    </div>
  )
}

export default InterviewPage