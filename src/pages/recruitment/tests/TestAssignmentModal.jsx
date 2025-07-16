import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Input, message } from 'antd';
import { getAllTestTypesApi } from '../../../services/testTypeService';
import { createTestAssignmentApi } from '../../../services/testAssignmentService';

const { Option } = Select;

const TestAssignmentModal = ({ open, onCancel, applicant, onSuccess }) => {
  const [form] = Form.useForm();
  const [testTypes, setTestTypes] = useState([]);

  useEffect(() => {
    if (open) {
      fetchTestTypes();
    }
  }, [open]);

  const fetchTestTypes = async () => {
    try {
      const data = await getAllTestTypesApi();
      setTestTypes(data);
    } catch {
      message.error('Failed to load test types');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        test_type: values.test_type, // array
        start_at: values.start_at,
        duration_min: values.duration_min,
        location: values.location,
        applicant_id: applicant._id,
        job_id: applicant.job_id?._id || applicant.job_id,
      };

      console.log('Payload to send:', payload);

      await createTestAssignmentApi(payload);

      message.success('Test assignment created successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Assignment error:', error);
      message.error('Failed to assign test');
    }
  };

  return (
    <Modal
      title="Assign Test"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Assign"
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Applicant Name">
          <Input value={applicant?.full_name_kh || applicant?.full_name_en} disabled />
        </Form.Item>

        <Form.Item
          label="Test Type(s)"
          name="test_type"
          rules={[{ required: true, message: 'Please select at least one test type' }]}
        >
          <Select mode="multiple" placeholder="Select test type(s)">
            {testTypes.map(t => (
              <Option key={t._id} value={t._id}>{t.name_en}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Start Time"
          name="start_at"
          rules={[{ required: true, message: 'Please choose a start time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Duration (minutes)" name="duration_min">
          <InputNumber min={1} placeholder="e.g. 60" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Location" name="location">
          <Input placeholder="Room 101, Lab A, etc." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TestAssignmentModal;
