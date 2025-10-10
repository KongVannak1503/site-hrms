import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, Table, message, Avatar } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateInterviewResultApi } from '../../../services/interviewApi';
import uploadUrl from '../../../services/uploadApi';
import dayjs from 'dayjs';
import { Card } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';

const InterviewResultModal = ({ open, interview, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { content } = useAuth();
  const [interviewData, setInterviewData] = useState(null);
  const [isMarkClicked, setIsMarkClicked] = useState(false);
  const [scoreChanges, setScoreChanges] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && interview) {
      setInterviewData(interview);
      const initialValues = {};

      interview.interviewers.forEach((i, idx) => {
        initialValues[`score_${idx}`] = i.score || 0;
        initialValues[`comment_${idx}`] = i.comment || '';
        initialValues[`attachments_${idx}`] = (i.attachments || []).map((filename, fileIdx) => ({
          uid: `${fileIdx}`,
          name: filename,
          status: 'done',
          url: `${uploadUrl}/uploads/interview-attachments/${filename}`
        }));
      });

      form.setFieldsValue(initialValues);
    }
  }, [open, interview]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (!interviewData || !interviewData.interviewers) {
        message.error('Interview data is not loaded.');
        return;
      }

      if (interviewData.status !== 'completed' && !isMarkClicked) {
        message.warning('Please click "Mark As Completed" before saving the final result.');
        return;
      }

      setSaving(true);

      const updatedInterviewers = interviewData.interviewers.map((i, idx) => {
        const score = values[`score_${idx}`] || 0;
        const comment = values[`comment_${idx}`] || '';
        const attachments = values[`attachments_${idx}`] || [];

        const newAttachments = attachments
          .map(file => file.originFileObj || file)
          .filter(file => file instanceof File);

        return {
          employee: i.employee._id || i.employee,
          score,
          comment,
          newAttachments
        };
      });

      const payload = {
        interviewers: updatedInterviewers,
        status: interviewData.status || 'scheduled'
      };

      await updateInterviewResultApi(interviewData._id, payload);
      message.success(content['saveSuccessful']);
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error('Error saving results');
    } finally {
      setSaving(false);
    }
  };

  const markAsCompleted = () => {
    setInterviewData(prev => {
      if (!prev || !prev.interviewers) {
        message.error("Interview data is missing.");
        return prev;
      }
      return {
        ...prev,
        status: 'completed'
      };
    });
    setIsMarkClicked(true);
    message.success('Marked as completed. Please save to confirm.');
  };

  const averageScore = (() => {
    if (!interviewData?.interviewers?.length) return '0.00';
    const total = interviewData.interviewers.reduce((sum, i, idx) => {
      const changedScore = scoreChanges[idx];
      return sum + (changedScore !== undefined ? changedScore : (i.score || 0));
    }, 0);
    return (total / interviewData.interviewers.length).toFixed(2);
  })();

  const columns = [
    {
      title: content['interviewer'],
      render: (_, __, idx) => {
        const interviewer = interviewData?.interviewers?.[idx]?.employee;
        if (!interviewer) return '—';

        const fullName = `${interviewer.last_name_en || ''} ${interviewer.first_name_en || ''}`.trim();
        const position = interviewer?.positionId?.title_en || '—';
        const photoPath = interviewer?.image_url?.path;
        const photoUrl = photoPath ? `${uploadUrl}/${photoPath}` : null;

        return (
          <div className="flex items-center gap-2">
            <Avatar src={photoUrl} size={40}>{!photoUrl && fullName.charAt(0)}</Avatar>
            <div className="flex flex-col">
              <span>{fullName}</span>
              <span className="text-xs text-gray-500">{position}</span>
            </div>
          </div>
        );
      }
    },
    {
      title: content['score'],
      render: (_, __, idx) => (
        <Form.Item name={`score_${idx}`} style={{ marginBottom: 0 }}>
          <InputNumber
            min={0}
            max={100}
            onChange={(value) => {
              setScoreChanges(prev => ({ ...prev, [idx]: value }));
            }}
          />
        </Form.Item>
      )
    },
    {
      title: content['comment'],
      render: (_, __, idx) => (
        <Form.Item name={`comment_${idx}`} style={{ marginBottom: 0 }}>
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>
      )
    },
    {
      title: content['attactFile'],
      render: (_, __, index) => (
        <>
          <Form.Item
            name={`attachments_${index}`}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList
                ? e.fileList.map(f => ({
                  ...f,
                  originFileObj: f.originFileObj || f,
                }))
                : [];
            }}
          >
            <Upload
              beforeUpload={() => false}
              multiple
              listType="text"
              accept="application/pdf,image/*"
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>
                {content['uploadAttachment'] || 'Upload'}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev[`attachments_${index}`] !== curr[`attachments_${index}`]}>
            {({ getFieldValue }) => {
              const fileList = getFieldValue(`attachments_${index}`) || [];
              return (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {fileList.map((file, i) => {
                    const rawPath = (file.url || file.response?.path || file.name || '').replace(/\\/g, '/');
                    const cleanFilename = rawPath.replace(/^.*[\\/]/, '');
                    const fileUrl = `${uploadUrl}/uploads/interview-attachments/${cleanFilename}`;
                    const fileExt = cleanFilename.split('.').pop()?.toLowerCase();
                    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExt);
                    const isPdf = fileExt === 'pdf';

                    return (
                      <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded text-sm text-gray-800 shadow-sm">
                        {isImage && <img src={fileUrl} alt="" className="w-6 h-6 object-cover rounded" />}
                        {isPdf && <UploadOutlined className="text-red-500" />}
                        {!isImage && !isPdf && <UploadOutlined className="text-gray-500" />}
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate hover:underline max-w-[180px]"
                          title={cleanFilename}
                        >
                          {cleanFilename}
                        </a>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </Form.Item>
        </>
      )
    }
  ];

  const data = interviewData?.interviewers?.map((_, idx) => ({ key: idx })) || [];

  return (
    <Modal
      title={content['interviewDetail']}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1200}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <div className="space-y-6">
          {/* Interview Info */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Card title={content['jobApplied']} className="shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                  <div className="font-medium text-gray-500">{content['job']}</div>
                  <div>{interviewData?.job_id?.job_title}</div>
                  <div className="font-medium text-gray-500">{content['applicantName']}</div>
                  <div>{interviewData?.applicant_id?.full_name_en}</div>
                  <div className="font-medium text-gray-500">{content['email']}</div>
                  <div>{interviewData?.applicant_id?.email}</div>
                  <div className="font-medium text-gray-500">{content['phone']}</div>
                  <div>{interviewData?.applicant_id?.phone_no}</div>
                  <div className="font-medium text-gray-500">{content['maritalStatus']}</div>
                  <div>{interviewData?.applicant_id?.marital_status}</div>
                  <div className="font-medium text-gray-500">{content['presentAddress']}</div>
                  <div>{interviewData?.applicant_id?.current_address}</div>
                </div>
              </Card>
            </div>

            <div className="w-full lg:w-[400px]">
              <Card title={content['interviewSchedule']} className="shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                  <div className="font-medium text-gray-500">{content['startOn']}</div>
                  <div>{dayjs(interviewData?.start_at).format('DD-MM-YYYY - hh:mm a')}</div>
                  <div className="font-medium text-gray-500">{content['duration']} (min)</div>
                  <div>{interviewData?.duration_min}</div>
                  <div className="font-medium text-gray-500">{content['location']}</div>
                  <div>{interviewData?.location || '—'}</div>
                  <div className="font-medium text-gray-500">{content['status']}</div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full inline-block ${interviewData?.status === 'completed' ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                    <span className={`font-medium ${interviewData?.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {interviewData?.status === 'completed' ? 'Completed' : 'Scheduled'}
                    </span>
                  </div>
                </div>
                <Button
                  type="primary"
                  className="mt-6 w-full"
                  onClick={markAsCompleted}
                  disabled={interviewData?.status === 'completed'}
                >
                  Mark As Completed
                </Button>
              </Card>
            </div>
          </div>

          {/* Interviewer Table */}
          <div>
            <Card title={content['interviewResult']} className="shadow">
              <Table
                columns={columns}
                scroll={{ x: 'max-content' }}
                dataSource={data}
                pagination={false}
                footer={() => (
                  <div className="text-right font-medium text-gray-600">
                    {content['averageScore']}: <span className="text-black">{averageScore}</span>
                  </div>
                )}
              />
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white py-4 flex justify-end gap-3 shadow">
            <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              {content['cancel']}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#002060] text-white px-4 py-2 rounded hover:bg-[#138496]"
              disabled={saving}
            >
              {saving ? 'Saving...' : content['save']}
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default InterviewResultModal;
