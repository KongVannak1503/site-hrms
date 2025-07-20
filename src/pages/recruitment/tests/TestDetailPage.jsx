import React, { useEffect, useState } from 'react';
import { Card, Tabs, InputNumber, Upload, Button, message, Spin, Table } from 'antd';
import { getTestAssignmentByIdApi, updateTestResultApi } from '../../../services/testAssignmentService';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Styles } from '../../../utils/CsStyle';
import uploadUrl from '../../../services/uploadApi';

const { TabPane } = Tabs;

const TestDetailPage = ({ assignmentId, onClose, refresh}) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [markCompleted, setMarkCompleted] = useState(false);
  const [isMarkClicked, setIsMarkClicked] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchData();
    }
  }, [refresh]); // 👈 now listens for refresh

  const fetchData = async () => {
    if (!assignmentId) return;
    setLoading(true);
    try {
      const data = await getTestAssignmentByIdApi(assignmentId);
      setAssignment(data);

      // Build new score map from backend
      const incomingScores = {};
      data.test_type_scores.forEach(item => {
        const id = item.test_type?._id || item.test_type;
        incomingScores[id] = item.score || 0;
      });

      // Merge with previous scores if any (for retained types)
      setScores(prev => {
        const merged = { ...prev }; // previous scores
        for (const [id, score] of Object.entries(incomingScores)) {
          merged[id] = score;
        }
        return merged;
      });

      setExistingFile(data.attachment || null);
    } catch (err) {
      console.error('Failed to load assignment:', err);
      message.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (testTypeId, value) => {
    setScores({ ...scores, [testTypeId]: value });
  };

  const handleSaveScores = async () => {
    if (assignment.status !== 'completed' && !markCompleted) {
      message.warning('Please mark the test as completed before saving results.');
      return;
    }

    try {
      const payload = {
        feedback: assignment.feedback,
        test_type_scores: Object.entries(scores).map(([test_type, score]) => ({
          test_type,
          score
        })),
        status: 'completed',
      };

      const formData = new FormData();
      formData.append('feedback', payload.feedback);
      formData.append('test_type_scores', JSON.stringify(payload.test_type_scores));
      formData.append('status', payload.status);

      if (selectedFile) {
        formData.append('attachment', selectedFile);
      } else if (existingFile) {
        formData.append('existing_attachment', existingFile); // retain
      }

      await updateTestResultApi(assignmentId, formData);

      message.success('Scores updated successfully');
      if (onClose) onClose();  // make sure this triggers parent refresh
    } catch (error) {
      console.error(error);
      message.error('Failed to update scores');
    }
  };

  if (loading || !assignment) return <Spin className="flex justify-center items-center" />;

  const { applicant_id, job_id, start_at, duration_min, location, test_type } = assignment;

  const columns = [
    {
      title: 'Test Name',
      key: 'name',
      render: (_, record) => record.test_type?.name_en || 'N/A',
    },
    {
      title: 'Score',
      key: 'score',
      render: (_, record) => (
        <InputNumber
          value={scores[record.test_type._id]}
          onChange={(value) => handleScoreChange(record.test_type._id, value)}
          min={0}
          max={100}
          style={{ width: 100 }}
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Applicant Info */}
          <Card title="Job Application" className='shadow'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
              <div className="font-medium text-gray-500">Job</div>
              <div>{job_id?.job_title}</div>

              <div className="font-medium text-gray-500">Applicant Name</div>
              <div>{applicant_id?.full_name_en}</div>

              <div className="font-medium text-gray-500">Email</div>
              <div>{applicant_id?.email || '--'}</div>

              <div className="font-medium text-gray-500">Phone</div>
              <div>{applicant_id?.phone_no || '--'}</div>

              <div className="font-medium text-gray-500">Marital Status</div>
              <div>{applicant_id?.marital_status || '--'}</div>

              <div className="font-medium text-gray-500">Current Address</div>
              <div>{applicant_id?.current_address || '--'}</div>
            </div>
          </Card>

          {/* Test Tabs */}
          <div className='mt-6'>
            <Card title="Result of Test" className="shadow">
              {/* Test Score Table */}
              <Table
                dataSource={assignment.test_type_scores}
                columns={columns}
                rowKey={(record) => record.test_type._id}
                pagination={false}
                footer={() => {
                  const total = Object.values(scores).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
                  const count = assignment.test_type_scores.length;
                  const average = count > 0 ? (total / count).toFixed(2) : 0;
                  return (
                    <div className="text-right font-medium text-gray-600">
                      Average Score: <span className="text-black">{average}</span>
                    </div>
                  );
                }}
              />

              {/* Feedback Input */}
              <div className="mt-6">
                <div className="text-sm font-medium text-gray-700 mb-1">Feedback</div>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write feedback here..."
                  value={assignment.feedback || ''}
                  onChange={(e) =>
                    setAssignment((prev) => ({ ...prev, feedback: e.target.value }))
                  }
                />
              </div>

              {/* File Upload + Display */}
              <div className="mt-6 space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-1">Attachment</div>
                <Upload
                  beforeUpload={(file) => {
                    setSelectedFile(file);
                    return false; // prevent automatic upload
                  }}
                  onRemove={() => {
                    setSelectedFile(null);
                    setExistingFile(null); // manually clear
                  }} 
                  fileList={
                    selectedFile
                      ? [selectedFile]
                      : existingFile
                      ? [
                          {
                            uid: '-1',
                            name: existingFile,
                            status: 'done',
                            url: `${uploadUrl}/uploads/test-assignments/${encodeURIComponent(existingFile)}`
                          }
                        ]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Upload File</Button>
                </Upload>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[400px]">
          <Card title="Test Schedule" className="shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
              
              <div className="font-medium text-gray-500">Start On</div>
              <div>{dayjs(start_at).format('DD-MM-YYYY - hh:mm a')}</div>

              <div className="font-medium text-gray-500">Duration Test (min)</div>
              <div>{duration_min}</div>

              <div className="font-medium text-gray-500">Location</div>
              <div>{location || '—'}</div>

              <div className="font-medium text-gray-500">Status</div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    assignment.status === 'completed' ? 'bg-green-500' : 'bg-yellow-400'
                  }`}
                ></span>
                <span
                  className={`font-medium ${
                    assignment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {assignment.status === 'completed' ? 'Completed' : 'Scheduled'}
                </span>
              </div>
            </div>

            <Button 
              type="primary" 
              className="mt-6 w-full" 
              onClick={() => {
                if (assignment.status !== 'completed') {
                  setMarkCompleted(true);
                  setIsMarkClicked(true);
                  setAssignment(prev => ({ ...prev, status: 'completed' }));
                  message.success('Marked as completed. You can now save.');
                }
              }}
              disabled={assignment.status === 'completed'}
            >
              Mark As Completed
            </Button>
          </Card>
        </div>
      </div>

      {/* ✅ Action Buttons (Footer) */}
      <div className="sticky bottom-0 bg-white py-4 flex justify-end gap-3 shadow">
        <button
          type="button"
          onClick={onClose}
          className={Styles.btnCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveScores}
          className={Styles.btnCreate}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TestDetailPage;
