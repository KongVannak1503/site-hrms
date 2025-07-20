import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Input, message } from 'antd';
import { getAllTestTypesApi } from '../../../services/testTypeService';
import { createTestAssignmentApi } from '../../../services/testAssignmentService';
import { getShortlistedApplicantsApi } from '../../../services/applicantApi';
import { updateJobApplicationStatus } from '../../../services/jobApplicationApi';

const { Option } = Select;

const TestAssignmentModal = ({ open, onCancel, applicant, onSuccess }) => {
  const [form] = Form.useForm();
  const [testTypes, setTestTypes] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTestTypes();

      if (!applicant) {
        fetchShortlistedApplicants();
      }
    }
  }, [open]);

  const fetchTestTypes = async () => {
    try {
      const data = await getAllTestTypesApi();
      setTestTypes(data);
    } catch (err) {
      message.error('Failed to load test types');
      console.error('Test types error:', err);
    }
  };

  const fetchShortlistedApplicants = async () => {
    setLoadingApplicants(true);
    try {
      const data = await getShortlistedApplicantsApi();
      setApplicants(data);
    } catch (err) {
      console.error('Applicant fetch error:', err);
      message.error('Failed to load applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const selectedApplicant = applicant || applicants.find(a => a._id === values.applicant_id);

      if (!selectedApplicant) {
        message.error('Selected applicant not found');
        return;
      }

      const payload = {
        test_type: values.test_type,
        start_at: values.start_at,
        duration_min: values.duration_min,
        location: values.location,
        applicant_id: selectedApplicant._id,
        job_id: selectedApplicant?.job_id?._id || selectedApplicant?.job_id,
      };

      console.log('Payload to send:', payload);

      await createTestAssignmentApi(payload);

      // ✅ New: update status to 'test' for selected applicant
      await updateJobApplicationStatus(
        selectedApplicant.job_application_id || selectedApplicant._id, // make sure this is the correct ID
        'test'
      );

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
        setApplicants([]);
        onCancel();
      }}
      onOk={handleOk}
      okText="Assign"
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        {applicant ? (
          <Form.Item label="Applicant Name">
            <Input value={applicant?.full_name_kh || applicant?.full_name_en} disabled />
          </Form.Item>
        ) : (
          <Form.Item
            label="Select Applicant"
            name="applicant_id"
            rules={[{ required: true, message: 'Please select an applicant' }]}
          >
            <Select
              placeholder="Select an applicant"
              showSearch
              loading={loadingApplicants}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase?.().includes(input.toLowerCase())
              }
            >
              {applicants.map((a) => (
                <Option key={a._id} value={a._id}>
                  {a.full_name_en} ({a.job_title || 'No job'})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

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
