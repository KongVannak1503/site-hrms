import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Input, message } from 'antd';
import dayjs from 'dayjs';
import { getAllTestTypesApi } from '../../../services/testTypeService';
import { updateTestAssignmentApi } from '../../../services/testAssignmentService';

const { Option } = Select;

const EditTestAssignmentModal = ({ open, onCancel, testAssignment, onSuccess }) => {
  const [form] = Form.useForm();
  const [testTypes, setTestTypes] = useState([]);

  useEffect(() => {
    if (open && testAssignment) {
      fetchTestTypes();
      form.setFieldsValue({
        test_type: testAssignment.extendedProps?.test_type?.map(t => t._id),
        start_at: dayjs(testAssignment.start),
        duration_min: testAssignment.extendedProps?.duration,
        location: testAssignment.extendedProps?.location,
      });
    }
  }, [open, testAssignment]);

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
        test_type: values.test_type,
        start_at: values.start_at,
        duration_min: values.duration_min,
        location: values.location
      };

      console.log('Payload to update:', payload);

      await updateTestAssignmentApi(testAssignment.id, payload);

      message.success('Test assignment updated successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Update error:', error);
      message.error('Failed to update test assignment');
    }
  };

  return (
    <Modal
      title="Edit Test Assignment"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Update"
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Applicant Name">
          <Input value={testAssignment?.extendedProps?.applicant?.full_name_en || 'N/A'} disabled />
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

export default EditTestAssignmentModal;
