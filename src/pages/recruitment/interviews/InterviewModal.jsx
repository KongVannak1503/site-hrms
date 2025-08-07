import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Button, Space } from 'antd';
import { getAllEmployeesApi } from '../../../services/employeeApi';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { createInterviewApi } from '../../../services/interviewApi';

const InterviewModal = ({ open, onCancel, applicant, job, onSuccess, eligibleApplicants = [] }) => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState([]);
    const [selectedTestData, setSelectedTestData] = useState(null);
    const isFromInterviewPage = eligibleApplicants && eligibleApplicants.length > 0;
    // const isFromInterviewPage = eligibleApplicants !== undefined;

    useEffect(() => {
        if (open) {
            fetchEmployees();
            form.resetFields();

            if (!isFromInterviewPage && applicant) {
                form.setFieldsValue({
                    applicant_name: applicant?.full_name_en,
                    start_at: null,
                    duration_min: '',
                    location: '',
                    interviewers: []
                });
            }
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
                applicant_id: isFromInterviewPage ? values.applicant_id : applicant._id,
                job_id: isFromInterviewPage
                    ? selectedTestData?.job_id?._id
                    : (typeof job === 'object' ? job?._id : job),
                interviewer_ids: values.interviewers,
                start_at: values.start_at,
                duration_min: values.duration_min,
                location: values.location
            };

            await createInterviewApi(payload);
            message.success('Interview scheduled successfully');
            onSuccess();
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error('Failed to schedule interview');
        }
    };

    return (
        <Modal
            title={content['create'] + ' ' + content['interviewSchedule']}
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
                {isFromInterviewPage ? (
                    <Form.Item
                        label={content['applicantName']}
                        name="applicant_id"
                        rules={[{ required: true, message: 'Please select an applicant' }]}
                    >
                        <Select
                            placeholder="Select an eligible applicant"
                            // notFoundContent="No eligible applicants available"
                            onChange={(value) => {
                                const selected = eligibleApplicants.find(item => item.applicant_id._id === value);
                                setSelectedTestData(selected);
                            }}
                        >
                            {eligibleApplicants.map((item) => (
                                <Select.Option key={item.applicant_id._id} value={item.applicant_id._id}>
                                    {item.applicant_id.full_name_en} - {item.job_id?.job_title || '—'}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    <Form.Item label={content['applicantName']} name="applicant_name">
                        <Input disabled />
                    </Form.Item>
                )}

                <Form.Item
                    label={content['interviewer']}
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

                <Form.Item label={content['startOn']} name="start_at" rules={[{required: true}]}>
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label={content['duration']} name="duration_min" rules={[{required: true}]}>
                    <InputNumber min={15} max={240} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label={content['location']} name="location">
                    <Input />
                </Form.Item>

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
