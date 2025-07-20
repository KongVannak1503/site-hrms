import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Content } from 'antd/es/layout/layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, Dropdown } from 'antd';
import dayjs from 'dayjs';

const InterviewPage = () => {
  const { isLoading, content } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['interviewSchedule'] }
  ];

  const todayTests = events.filter(ev =>
    dayjs(ev.start).isSame(dayjs(), 'day')
  );

  return (
    <div>
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#17a2b8]'>ព័ត៌មាន{content['interviewSchedule']}</h1>
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
          <div className='flex flex-col sm:flex-row justify-between items-center w-full'></div>
        </Content>
      </div>

      <div className='mt-4'>
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
              // events={events}
              // eventClick={handleEventClick}
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
      </div>

    </div>
  )
}

export default InterviewPage