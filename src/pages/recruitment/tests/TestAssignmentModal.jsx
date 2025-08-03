import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, Input, message, Space } from 'antd';
import { getAllTestTypesApi } from '../../../services/testTypeService';
import { createTestAssignmentApi } from '../../../services/testAssignmentService';
import { getShortlistedApplicantsApi } from '../../../services/applicantApi';
import { updateJobApplicationStatus } from '../../../services/jobApplicationApi';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';

const { Option } = Select;

const TestAssignmentModal = ({ open, onCancel, applicant, onSuccess }) => {
  const {content} = useAuth();
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

  const handleSubmit = async (values) => {
    try {
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

      await createTestAssignmentApi(payload);

      await updateJobApplicationStatus(
        selectedApplicant.job_application_id || selectedApplicant._id,
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
      footer={null}
      centered
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
          label={content['testType']}
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
          label={content['startOn']}
          name="start_at"
          rules={[{ required: true, message: 'Please choose a start time' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={content['duration']} name="duration_min" rules={[{required: true, message: "Please "}]}>
          <InputNumber min={1} placeholder="e.g. 60" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={content['location']} name="location">
          <Input placeholder="Room 101, Lab A, etc." />
        </Form.Item>

        <Form.Item>
          <Space className="flex justify-end w-full">
            <button type="button" onClick={onCancel} className={Styles.btnCancel}>
              {content['cancel']}
            </button>
            <button type="submit" className={Styles.btnCreate}>
              {content['save']}
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TestAssignmentModal;
