import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import { rescheduleInterviewApi } from '../../../services/interviewApi';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';

const RescheduleModal = ({ open, interview, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { content } = useAuth();

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
      message.success(content['saveSuccessful']);
      onSuccess();
    } catch (err) {
      message.error('Failed to reschedule interview');
    }
  };

  return (
    <Modal
      open={open}
      title={`${content['reschedule']} ${content['interview']}`}
      onCancel={onCancel}
      footer={null}
      centered
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={content['date']}
          name="start_at"
          rules={[{ required: true, message: 'Please select new start time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Space className="flex justify-end w-full">
            <button type="button" onClick={onCancel} className={Styles.btnCancel}>
              {content['cancel']}
            </button>
            <button type="submit" className={Styles.btnUpdate}>
              {content['update']}
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RescheduleModal;
