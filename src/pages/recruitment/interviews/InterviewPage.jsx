import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Content } from 'antd/es/layout/layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Avatar, Button, Card, Col, DatePicker, Dropdown, Form, Input, Row, Select, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { getAllInterviewsApi } from '../../../services/interviewApi';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { FaList, FaRegCalendar } from 'react-icons/fa6';
import { EllipsisOutlined } from '@ant-design/icons';
import uploadUrl from '../../../services/uploadApi';
import EditInterviewModal from './EditInterviewModal';
import RescheduleModal from './InterviewRescheduleModal';
import InterviewResultModal from './InterviewResultModal';
import DateDisplayBox from '../../../utils/DateDisplayBox';

const InterviewPage = () => {
  const { isLoading, content } = useAuth();
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

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['interviewSchedule'] }
  ];

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
        title: `${item.applicant_id?.full_name_en || 'Unnamed'} - ${
          item.job_id?.job_title || 'No Title'
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
              {
                key: 'edit',
                label: <span>Edit</span>,
                onClick: () => {
                  const interview = interviews.find((i) => i._id === record.id);
                  setEditModalData({ visible: true, interview });
                }
              },
              {
                key: 'reschedule',
                label: <span>Reschedule</span>,
                onClick: () => {
                  const interview = interviews.find(i => i._id === record.id);
                  setRescheduleModalData({ visible: true, interview });
                }
              }
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
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មាន{content['interviewSchedule']}</h1>
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
                        <DatePicker.RangePicker style={{ width: '100%' }} placeholder={[content['startDate'], content['endDate']]}/>
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
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, size) => setPagination({ ...pagination, current: page, pageSize: size })
              }}
            />
          </div>
        )}
        
      </div>

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