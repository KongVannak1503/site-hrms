import React, { useEffect, useState } from 'react';
import { Modal, Card, InputNumber, Upload, Button, message, Spin, Table, Input } from 'antd';
import { getTestAssignmentByIdApi, updateTestResultApi } from '../../../services/testAssignmentService';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import uploadUrl from '../../../services/uploadApi';
import { useAuth } from '../../../contexts/AuthContext';
import { Styles } from '../../../utils/CsStyle';

const TestDetailPage = ({ open, assignmentId, onClose, refresh }) => {
  const { content } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [markCompleted, setMarkCompleted] = useState(false);

  useEffect(() => {
    if (assignmentId) fetchData();
  }, [refresh, assignmentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTestAssignmentByIdApi(assignmentId);

      setAssignment(data);
      const initialScores = {};
      data.test_type_scores.forEach(item => {
        const id = item.test_type?._id || item.test_type;
        initialScores[id] = item.score || 0;
      });
      setScores(initialScores);
      setExistingFile(data.attachment || null);
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
    const allowedStatuses = ['completed', 'rejected'];

    if (!allowedStatuses.includes(assignment.status) && !markCompleted) {
      message.warning('Please mark the test as completed before saving.');
      return;
    }
    try {
      const payload = {
        feedback: assignment.feedback,
        test_type_scores: Object.entries(scores).map(([test_type, score]) => ({ test_type, score })),
        status: assignment.status === 'rejected' ? 'rejected' : 'completed',
      };

      const formData = new FormData();
      formData.append('feedback', payload.feedback);
      formData.append('test_type_scores', JSON.stringify(payload.test_type_scores));
      formData.append('status', payload.status);

      if (selectedFile) {
        formData.append('attachment', selectedFile);
      } else if (existingFile) {
        formData.append('existing_attachment', existingFile);
      }

      await updateTestResultApi(assignmentId, formData);
      message.success(content['saveSuccessful'] || 'Scores updated successfully');
      if (onClose) onClose();
    } catch (error) {
      message.error('Failed to update scores');
    }
  };

  if (!open) return null;

  if (loading || !assignment) return <Spin className="flex justify-center items-center" />;

  const { applicant_id, job_id, start_at, duration_min, location } = assignment;
  const averageScore = Object.values(scores).length
    ? (Object.values(scores).reduce((a, b) => a + Number(b), 0) / Object.values(scores).length).toFixed(2)
    : '0.00';

  const columns = [
    {
      title: content['testName'],
      key: 'name',
      render: (_, record) => record.test_type?.name_en || 'N/A',
    },
    {
      title: content['score'],
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
    <Modal
      open={open}
      onCancel={onClose}
      title={content['testDetail'] || 'Test Assignment Details'}
      footer={null}
      width={1200}
      maskClosable={false}
    >
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Card title={content['jobApplication']} className="shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                <div className="font-medium text-gray-500">{content['job']}</div>
                <div>{job_id?.job_title}</div>
                <div className="font-medium text-gray-500">{content['applicantName']}</div>
                <div>{applicant_id?.full_name_en}</div>
                <div className="font-medium text-gray-500">{content['email']}</div>
                <div>{applicant_id?.email || '--'}</div>
                <div className="font-medium text-gray-500">{content['phone']}</div>
                <div>{applicant_id?.phone_no || '--'}</div>
                <div className="font-medium text-gray-500">{content['maritalStatus']}</div>
                <div>{applicant_id?.marital_status || '--'}</div>
                <div className="font-medium text-gray-500">{content['presentAddress']}</div>
                <div>{applicant_id?.current_address || '--'}</div>
              </div>
            </Card>
          </div>

          <div className="w-full lg:w-[400px]">
            <Card title={content['testSchedule']} className="shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                <div className="font-medium text-gray-500">{content['startOn']}</div>
                <div>{dayjs(start_at).format('DD-MM-YYYY - hh:mm a')}</div>
                <div className="font-medium text-gray-500">{content['duration']} (min)</div>
                <div>{duration_min}</div>
                <div className="font-medium text-gray-500">{content['location']}</div>
                <div>{location || '—'}</div>
                <div className="font-medium text-gray-500">{content['status']}</div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full inline-block ${assignment.status === 'completed' || assignment.status === 'rejected' ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                  <span className={`font-medium ${assignment.status === 'completed' || assignment.status === 'rejected' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {assignment.status === 'completed' || assignment.status === 'rejected' ? 'Completed' : 'Scheduled'}
                  </span>
                </div>
              </div>
              <Button
                type="primary"
                className="mt-6 w-full"
                onClick={() => {
                  if (assignment.status !== 'completed' || assignment.status !== 'rejected') {
                    setMarkCompleted(true);
                    setAssignment(prev => ({ ...prev, status: 'completed' }));
                    message.success('Marked as completed. You can now save.');
                  }
                }}
                disabled={assignment.status === 'completed' || assignment.status === 'rejected'}
              >
                Mark As Completed
              </Button>
            </Card>
          </div>
        </div>

        <Card title={content['resultTest']} className="shadow">
          <Table
            dataSource={assignment.test_type_scores}
            columns={columns}
            rowKey={(record) => record.test_type._id}
            pagination={false}
            footer={() => (
              <div className="text-right font-medium text-gray-600">
                {content['averageScore']}: <span className="text-black">{averageScore}</span>
              </div>
            )}
          />

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">{content['comment']}</div>
            <Input.TextArea
              rows={4}
              placeholder="Write feedback here..."
              value={assignment.feedback || ''}
              onChange={(e) => setAssignment((prev) => ({ ...prev, feedback: e.target.value }))}
            />
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">{content['attactFile']}</div>
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              onRemove={() => {
                setSelectedFile(null);
                setExistingFile(null);
              }}
              fileList={
                selectedFile
                  ? [selectedFile]
                  : existingFile
                    ? [{ uid: '-1', name: existingFile, status: 'done', url: `${uploadUrl}/uploads/test-assignments/${encodeURIComponent(existingFile)}` }]
                    : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </div>
        </Card>

        <div className="sticky bottom-0 bg-white py-4 flex justify-end gap-3 shadow px-6">
          <button type="button" onClick={onClose} className={Styles.btnCancel}>
            {content['cancel']}
          </button>
          <button type="button" onClick={handleSaveScores} className={Styles.btnCreate}>
            {content['save']}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TestDetailPage;
