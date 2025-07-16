import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, InputNumber, message } from 'antd';
import { updateTestScheduleApi } from '../../../services/testAssignmentService';
import dayjs from 'dayjs';

const RescheduleTestModal = ({ open, onCancel, assignment, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && assignment) {
      form.setFieldsValue({
        start_at: dayjs(assignment.start),
        duration_min: assignment.extendedProps.duration,
      });
    }
  }, [open, assignment, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        start_at: values.start_at,
        duration_min: values.duration_min
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
      title="Reschedule Test"
      okText="Update"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Start Time"
          name="start_at"
          rules={[{ required: true, message: 'Please choose a start time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RescheduleTestModal;
