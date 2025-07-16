import React, { useEffect, useState } from 'react';
import { Card, Tabs, InputNumber, Upload, Button, message, Spin, Table } from 'antd';
import { getTestAssignmentByIdApi } from '../../../services/testAssignmentService';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const TestDetailPage = ({ assignmentId, onClose}) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      const data = await getTestAssignmentByIdApi(assignmentId);
      setAssignment(data);
      const initScores = {};
      data.test_type.forEach(t => {
        initScores[t._id] = t.score || 0;
      });
      setScores(initScores);
    } catch (err) {
      message.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (testTypeId, value) => {
    setScores({ ...scores, [testTypeId]: value });
  };

  const handleSaveScores = async () => {
    try {
      // await updateTestScoreApi(id, { scores });
      message.success('Scores updated successfully');
      if (onClose) onClose();
    } catch {
      message.error('Failed to update scores');
    }
  };

  if (loading || !assignment) return <Spin className="flex justify-center items-center" />;

  const { applicant_id, job_id, start_at, duration_min, location, test_type } = assignment;

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => record.name_en,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (_, record) => (
        <InputNumber
          value={scores[record._id]}
          onChange={(value) => handleScoreChange(record._id, value)}
          min={0}
          max={100}
          style={{ width: 100 }}
        />
      )
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Section */}
      <div className="flex-1 space-y-6">
        {/* Applicant Info */}
        <Card title="Test Details" className='shadow'>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
            <div className="font-medium text-gray-500">Job</div>
            <div>{job_id?.job_title}</div>

            <div className="font-medium text-gray-500">Candidate Name</div>
            <div>{applicant_id?.full_name_en}</div>

            <div className="font-medium text-gray-500">Candidate Email</div>
            <div>{applicant_id?.email || '--'}</div>

            <div className="font-medium text-gray-500">Phone</div>
            <div>{applicant_id?.phone || '--'}</div>

            <div className="font-medium text-gray-500">Comment</div>
            <div>{applicant_id?.comment || '--'}</div>

            <div className="font-medium text-gray-500">Resume</div>
            <div>{applicant_id?.resume || '--'}</div>
          </div>
        </Card>

        {/* Test Tabs */}
        <div className='mt-6'>
          <Card title="Result of Test" className='shadow'>
            <Table
              dataSource={test_type}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />

            <div className="mt-6">
              <Upload
                name="file"
                action={`/test-assignments/${assignmentId}/files`}
                headers={{ authorization: 'Bearer your-token' }}
                multiple
              >
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[400px]">
        <Card title="Interview Rounds" className='shadow'>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="font-semibold">HR round</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
              <span className="text-yellow-600 font-medium">Pending</span>
            </div>

            <div>
              <span className="font-medium text-gray-500">Start On:</span>{' '}
              {dayjs(start_at).format('DD-MM-YYYY - hh:mm a')}
            </div>
            <div>
              <span className="font-medium text-gray-500">Location:</span>{' '}
              {location || '—'}
            </div>

            <Button type="primary" className="mt-4 w-full">Mark As Completed</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestDetailPage;
