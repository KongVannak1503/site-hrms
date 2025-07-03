import { Button, Card, Checkbox, DatePicker, Form, Input, message } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { Styles } from '../../utils/CsStyle';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import EmployeeNav from './EmployeeNav';
import moment from 'moment';
import { createHistoryApi, getHistoryApi } from '../../services/employeeApi';

const EmployeeHistoryPage = () => {
    const { content } = useAuth();
    const [form] = Form.useForm();
    const { id } = useParams();
    const [historyId, setHistoryId] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getHistoryApi(id);

                setHistoryId(response._id || null);

                form.setFieldsValue({
                    employment_history: response.employment_history?.map(item => ({
                        ...item,
                        start_date: item.start_date ? moment(item.start_date) : null,
                        end_date: item.end_date ? moment(item.end_date) : null,
                    })) || [],
                });
            } catch (error) {
                if (error.response?.status === 404) {
                    setHistoryId(null);  // no record found — new record
                    form.resetFields();
                } else {
                    console.error('Failed to fetch employee data:', error);
                }
            }
        };

        if (id) {
            fetchInitialData();
        }
    }, [id, content]);


    const handleFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('employment_history', JSON.stringify(values.employment_history || []));
            await createHistoryApi(id, formData);
            message.success('Save successfully!');
        } catch (error) {
            console.error('Error saving Education:', error);
            message.error('Failed to save Education');
        }
    };

    return (
        <div className="flex flex-col">
            {/* Fixed Tabs */}
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <EmployeeNav />
            </div>
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                autoComplete="off"
                style={{
                    paddingTop: 70,
                    paddingBottom: 100,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                <div>
                    <Card title="Exact title of your post" className="shadow">
                        <Form.List name="employment_history">
                            {(fields, { add, remove }) => (
                                <>
                                    <table className="table-auto w-full">
                                        <thead className={Styles.tHead}>
                                            <tr className='pt-3 border-b'>
                                                <th className={Styles.tHeadL}>
                                                    Position
                                                </th>
                                                <th className="px-3 py-2 text-center">Company</th>
                                                <th className="px-3 py-2 text-center">Name of Supervisor</th>
                                                <th className="px-3 py-2 text-center">Phone</th>
                                                <th className="px-3 py-2 text-center">Address</th>
                                                <th className="px-3 py-2 text-center">Start Date</th>
                                                <th className="px-3 py-2 text-center">End Date</th>
                                                <th className={Styles.tHeadR}></th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {fields.map(({ key, name, ...restField }, index) => (
                                                <tr key={key} className="hover:bg-[#f0fbfd] transition">
                                                    {/* Name */}
                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'position']}
                                                            className="mb-0"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </td>
                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'company']}
                                                            className="mb-0"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </td>

                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'supervisor_name']}
                                                            className="mb-0"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </td>
                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'phone']}
                                                            className="mb-0"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </td>

                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'address']}
                                                            className="mb-0"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </td>

                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'start_date']}
                                                            className="mb-0"
                                                        >
                                                            <DatePicker className='w-[100%]' />
                                                        </Form.Item>
                                                    </td>
                                                    <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'end_date']}
                                                            className="mb-0"
                                                        >
                                                            <DatePicker className='w-[100%]' />
                                                        </Form.Item>
                                                    </td>

                                                    {/* Remove button */}
                                                    <td className={`px-3 ${index === 0 ? 'pt-0' : 'flex justify-start'}`}>
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<MinusCircleOutlined />}
                                                            onClick={() => remove(name)}
                                                            aria-label="Remove language"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="pt-5">
                                        <Form.Item className="mt-4">
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                Add Language
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </>
                            )}
                        </Form.List>
                    </Card>
                </div>
                <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                    style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                    <button type="button" className={Styles.btnCancel}>Cancel</button>
                    <button type="submit" className={Styles.btnCreate}>Submit</button>
                </div>
            </Form>
        </div >
    )
}

export default EmployeeHistoryPage
