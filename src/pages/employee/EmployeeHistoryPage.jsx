import { Button, Card, Checkbox, DatePicker, Form, Input } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React from 'react'
import { Styles } from '../../utils/CsStyle';

const EmployeeHistoryPage = ({ content }) => {
    return (
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
    )
}

export default EmployeeHistoryPage
