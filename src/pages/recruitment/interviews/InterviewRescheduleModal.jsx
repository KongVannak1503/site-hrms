import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import { rescheduleInterviewApi } from '../../../services/interviewApi';
import { Styles } from '../../../utils/CsStyle';

const RescheduleModal = ({ open, interview, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && interview) {
      form.setFieldsValue({
        start_at: interview?.start_at ? dayjs(interview.start_at) : null
      });
    }
  }, [open, interview]);

  const handleSubmit = async (values) => {
    try {
      await rescheduleInterviewApi(interview._id, values.start_at);
      message.success('Interview rescheduled successfully');
      onSuccess();
    } catch (err) {
      message.error('Failed to reschedule interview');
    }
  };

  return (
    <Modal
      open={open}
      title="Reschedule Interview"
      onCancel={onCancel}
      footer={null}
      centered
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="New Start Time"
          name="start_at"
          rules={[{ required: true, message: 'Please select new start time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Space className="flex justify-end w-full">
            <button type="button" onClick={onCancel} className={Styles.btnCancel}>
              Cancel
            </button>
            <button type="submit" className={Styles.btnUpdate}>
              Update
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RescheduleModal;
