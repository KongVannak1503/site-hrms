import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Button, Dropdown, message, Card, Table } from 'antd';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { FaList, FaRegCalendar } from "react-icons/fa6";
import {
  getAllTestAssignmentsApi,
  deleteTestAssignmentApi
} from '../../../services/testAssignmentService';
import dayjs from 'dayjs';
import EditTestAssignmentModal from './EditTestAssignmentModal';
import RescheduleTestModal from './RescheduleModal';
import { Styles } from '../../../utils/CsStyle';
import { useNavigate } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import ModalMdCenter from '../../../components/modals/ModalMdCenter';
import TestDetailPage from './TestDetailPage';

const TestSchedulePage = () => {
  const { isLoading, content } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalData, setEditModalData] = useState({ visible: false, assignment: null });
  const [rescheduleModalData, setRescheduleModalData] = useState({ visible: false, assignment: null });
  const [detailModalData, setDetailModalData] = useState({ visible: false, assignmentId: null });
  const [viewMode, setViewMode] = useState('calendar');
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['testSchedule'] }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllTestAssignmentsApi();

      const today = new Date();
      const formatted = data.map(item => {
        const title = `${item?.applicant_id?.full_name_en || 'Unknown'} - ${item?.test_type?.map(t => t.name_en).join(', ')}`;
        return {
          id: item._id,
          title,
          start: item.start_at,
          extendedProps: {
            applicant: item.applicant_id,
            test_type: item.test_type,
            location: item.location,
            duration: item.duration_min,
            job: item.job_id?.job_title
          }
        };
      });

      setEvents(formatted);

      const todayTest = formatted.find(e => {
        const d = new Date(e.start);
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      });
      if (todayTest) setSelectedEvent(todayTest);

    } catch (err) {
      message.error('Failed to load test schedules');
    }
  };

  const handleEventClick = ({ event }) => {
    // setSelectedEvent(event);
    // navigate(`/test-schedules/${event.id}`);
    setDetailModalData({ visible: true, assignmentId: event.id });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTestAssignmentApi(id);
      message.success('Schedule deleted');
      fetchEvents();
      setSelectedEvent(null);
    } catch {
      message.error('Failed to delete schedule');
    }
  };

  const todayTests = events.filter(ev =>
    dayjs(ev.start).isSame(dayjs(), 'day')
  );

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      render: (text) => text ? <img src={`${uploadUrl}/uploads/applicants/${encodeURIComponent(text)}`} width={60} /> : '-'
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
      title: 'Job Title',
      dataIndex: 'job_title',
      render: (text) => text || '-'
    },
    {
      title: 'Gender',
      dataIndex: 'gender'
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
    },
    {
      title: 'Action'
    },
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
              <button className={Styles.btnCreate}>
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
                // height={600}
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
                        // onClick={() => navigate(`/test-schedules/${selectedEvent.id}`)}
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
                <Card title="Test Schedule" className="shadow">
                  <p>No test scheduled today.</p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md shadow">
            <Table 
              className='custom-pagination custom-checkbox-table'
              loading={isLoading}
              scroll={{ x: 'max-content' }}
              rowKey='_id'
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
          fetchEvents();
        }}
      />

      <RescheduleTestModal
        open={rescheduleModalData.visible}
        assignment={rescheduleModalData.assignment}
        onCancel={() => setRescheduleModalData({ visible: false, assignment: null })}
        onSuccess={() => {
          setRescheduleModalData({ visible: false, assignment: null });
          fetchEvents();
        }}
      />

      <ModalMdCenter
        open={detailModalData.visible}
        onCancel={() => setDetailModalData({ visible: false, assignmentId: null })}
        title="Test Assignment Details"
        width={1200}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDetailModalData({ visible: false, assignmentId: null })} className={Styles.btnCancel}>
              Cancel
            </button>
            <button type="primary" onClick={() => document.getElementById('save-test-scores')?.click()} className={Styles.btnCreate}>
              Save
            </button>
          </div>
        }
      >
        {detailModalData.assignmentId && (
          <TestDetailPage 
            assignmentId={detailModalData.assignmentId} 
          />
        )}
      </ModalMdCenter>

    </div>
  );
};

export default TestSchedulePage;
