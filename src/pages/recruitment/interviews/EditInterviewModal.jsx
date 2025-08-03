import React, { useEffect, useState } from 'react';
import { Modal, Form, DatePicker, InputNumber, Select, Input, message } from 'antd';
import { getAllEmployeesApi } from '../../../services/employeeApi';
import { updateInterviewApi } from '../../../services/interviewApi';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import dayjs from 'dayjs';

const EditInterviewModal = ({ open, interview, onCancel, onSuccess }) => {
  const {content} = useAuth();
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (open && interview) {
      fetchEmployees();
      const values = {
        applicant_name: interview.applicant_id?.full_name_en || '',
        start_at: interview.start_at ? dayjs(interview.start_at) : null,
        duration_min: interview.duration_min,
        location: interview.location,
        interviewers: interview.interviewers?.map(i => i.employee?._id || i.employee) || []
      };

      form.setFieldsValue(values);
    }
  }, [open, interview]);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployeesApi();
      // console.log('Employees fetched:', data);
      setEmployees(data);
    } catch {
      message.error('Failed to load employees');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        start_at: values.start_at,
        duration_min: values.duration_min,
        location: values.location,
        interviewer_ids: values.interviewers
      };

      await updateInterviewApi(interview.id || interview._id, payload);
      message.success('Interview updated successfully');
      onSuccess();
    } catch (err) {
      message.error('Failed to update interview');
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Interview"
      onCancel={onCancel}
      // onOk={() => form.submit()}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={content['applicantName']} name="applicant_name">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={content['interviewer']}
          name="interviewers"
          rules={[{ required: true, message: 'Please select interviewers' }]}
        >
          <Select mode="multiple" placeholder="Select interviewers">
            {employees.map(emp => (
              <Select.Option key={emp._id} value={emp._id}>
                {`${emp.last_name_en || ''} ${emp.first_name_en || ''}`.trim() || 'Unnamed'} {emp.position ? `(${emp.position})` : ''}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="start_at" label={content['startOn']} rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="duration_min" label={content['duration']} rules={[{ required: true }]}>
          <InputNumber min={15} max={240} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="location" label={content['location']} >
          <Input />
        </Form.Item>

        <Form.Item className="text-right">
          <button type="button" onClick={onCancel} className={Styles.btnCancel}>
            {content['cancel']}
          </button>
          <button type="submit" className={Styles.btnUpdate}>
            {content['update']}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditInterviewModal;
