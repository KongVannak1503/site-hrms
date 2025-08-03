import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Input, message } from 'antd';
import dayjs from 'dayjs';
import { getAllTestTypesApi } from '../../../services/testTypeService';
import { updateTestAssignmentApi } from '../../../services/testAssignmentService';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';

const EditTestAssignmentModal = ({ open, onCancel, testAssignment, onSuccess }) => {
  const [form] = Form.useForm();
  const [testTypes, setTestTypes] = useState([]);
  const { content } = useAuth();

  useEffect(() => {
    const fetchAndSetForm = async () => {
      if (open && testAssignment) {
        try {
          const types = await getAllTestTypesApi();
          setTestTypes(types);

          const testTypeIds = testAssignment.extendedProps?.test_type_scores?.map(
            (t) => typeof t.test_type === 'object' ? t.test_type._id : t.test_type
          ) || [];

          form.setFieldsValue({
            applicant_name: testAssignment.extendedProps?.applicant?.full_name_en || '',
            test_type: testTypeIds,
            start_at: dayjs(testAssignment.start),
            duration_min: testAssignment.extendedProps?.duration,
            location: testAssignment.extendedProps?.location,
          });
        } catch (err) {
          message.error('Failed to load test types');
        }
      }
    };

    fetchAndSetForm();
  }, [open, testAssignment]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        test_type: values.test_type,
        start_at: values.start_at,
        duration_min: values.duration_min,
        location: values.location
      };

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
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={content['applicantName'] || 'Applicant Name'} name="applicant_name">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={content['testType'] || 'Test Type(s)'}
          name="test_type"
          rules={[{ required: true, message: 'Please select at least one test type' }]}
        >
          <Select mode="multiple" placeholder="Select test type(s)">
            {testTypes.map((t) => (
              <Select.Option key={t._id} value={t._id}>
                {t.name_en}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={content['startOn'] || 'Start Time'}
          name="start_at"
          rules={[{ required: true, message: 'Please choose a start time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={content['duration'] || 'Duration (minutes)'}
          name="duration_min"
          rules={[{ required: true, message: 'Please enter duration' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 60" />
        </Form.Item>

        <Form.Item label={content['location'] || 'Location'} name="location">
          <Input placeholder="Room 101, Lab A, etc." />
        </Form.Item>

        <Form.Item className="text-right">
          <button type="button" onClick={onCancel} className={Styles.btnCancel}>
            {content['cancel'] || 'Cancel'}
          </button>
          <button type="submit" className={Styles.btnUpdate}>
            {content['update'] || 'Update'}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTestAssignmentModal;
