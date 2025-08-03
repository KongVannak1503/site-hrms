import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Button, Space } from 'antd';
import { getAllEmployeesApi } from '../../../services/employeeApi';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { createInterviewApi } from '../../../services/interviewApi';

const InterviewModal = ({ open, onCancel, applicant, job, onSuccess }) => {
    const {content} = useAuth();
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (open) {
            fetchEmployees();
            form.setFieldsValue({
                applicant_name: applicant?.full_name_en,
                start_at: null,
                duration_min: '',
                location: '',
                interviewers: []
            });
        }
    }, [open]);

    const fetchEmployees = async () => {
        try {
            const data = await getAllEmployeesApi();
            setEmployees(data);
        } catch {
            message.error('Failed to load employees');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                applicant_id: applicant._id,
                job_id: typeof job === 'object' ? job?._id : job,
                interviewer_ids: values.interviewers,
                start_at: values.start_at,
                duration_min: values.duration_min,
                location: values.location
            };

            // console.log('🚀 Submitting Payload:', payload);

            await createInterviewApi(payload);

            message.success('Interview scheduled successfully');
            onSuccess(); // refresh list or close modal
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error('Failed to schedule interview');
        }
    };

  return (
    <Modal
        title="Schedule Interview"
        open={open}
        footer={null}
        onCancel={onCancel}
        maskClosable={false}
    >
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item label="Applicant" name="applicant_name">
                <Input disabled />
            </Form.Item>

            <Form.Item
                label="Interviewers"
                name="interviewers"
                rules={[{ required: true, message: 'Please select interviewers' }]}
            >
                <Select mode="multiple" placeholder="Select interviewers">
                    {employees.map(emp => (
                        <Select.Option key={emp._id} value={emp._id}>
                        {emp.name_en} {emp.position ? `(${emp.position})` : ''}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Start At"
                name="start_at"
                // rules={[{ required: true, message: 'Please select start time' }]}
            >
                <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Duration (Minutes)"
                name="duration_min"
                // rules={[{ required: true, message: 'Please input duration' }]}
            >
                <InputNumber min={15} max={240} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Location"
                name="location"
                // rules={[{ required: true, message: 'Please input Location' }]}
            >
                <Input />
            </Form.Item>

            {/* ✅ Footer Buttons inside Form */}
            <Form.Item>
                <Space className="flex justify-end w-full">
                    <button onClick={onCancel} className={Styles.btnCancel}>{content['cancel']}</button>
                    <button htmlType="submit" className={Styles.btnCreate}>{content['save']}</button>
                </Space>
            </Form.Item>
      </Form>
    </Modal>
  );
};

export default InterviewModal;
