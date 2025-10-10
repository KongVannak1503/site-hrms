import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import { updateTestScheduleApi } from '../../../services/testAssignmentService';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';

const RescheduleTestModal = ({ open, onCancel, assignment, onSuccess }) => {
  const { content } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && assignment) {
      form.setFieldsValue({
        start_at: dayjs(assignment.start),
      });
    }
  }, [open, assignment]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        start_at: values.start_at,
        duration_min: assignment.extendedProps?.duration, // keep existing duration
      };

      await updateTestScheduleApi(assignment.id, payload);
      message.success('Test rescheduled successfully');
      form.resetFields();
      onSuccess();
    } catch (err) {
      console.error(err);
      message.error('Failed to reschedule test');
    }
  };

  return (
    <Modal
      open={open}
      title={`${content['reschedule']}`}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      centered
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={content['startOn']}
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

export default RescheduleTestModal;
