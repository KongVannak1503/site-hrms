import { Button, Card, Checkbox, DatePicker, Form, Input } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React from 'react'
import { FaRegImages } from 'react-icons/fa';
import { Styles } from '../../utils/CsStyle';

const EmployeeEducationTab = ({ content }) => {
    return (
        <div>
            <Card title="Foreign Languages" className="shadow">
                <Form.List name="language">
                    {(fields, { add, remove }) => (
                        <>
                            <table className="table-auto w-full">
                                <thead className="bg-[#17a2b8] text-left text-gray-200 font-semibold rounded-t-md">
                                    <tr className='pt-3 border-b'>
                                        <th rowSpan={2} className="px-3 py-2 text-center first:rounded-tl-md last:rounded-tr-md">
                                            Languages
                                        </th>
                                        <th colSpan={3} className="px-3 py-2 text-center">Read</th>
                                        <th colSpan={3} className="px-3 py-2 text-center">Write</th>
                                        <th colSpan={3} className="px-3 py-2 text-center">Speak</th>
                                        <th colSpan={3} className="px-3 py-2 text-center">Listen</th>
                                        <th rowSpan={2} className="px-3 py-2 w-12 first:rounded-tl-md last:rounded-tr-md"></th>
                                    </tr>
                                    <tr className="text-center bg-[#17a2b8]">
                                        <th className="pt-1 pb-3 px-1">Poor</th>
                                        <th className="pt-1 pb-3 px-1">Fair</th>
                                        <th className="pt-1 pb-3 px-1">Good</th>
                                        <th className="pt-1 pb-3 px-1">Poor</th>
                                        <th className="pt-1 pb-3 px-1">Fair</th>
                                        <th className="pt-1 pb-3 px-1">Good</th>
                                        <th className="pt-1 pb-3 px-1">Poor</th>
                                        <th className="pt-1 pb-3 px-1">Fair</th>
                                        <th className="pt-1 pb-3 px-1">Good</th>
                                        <th className="pt-1 pb-3 px-1">Poor</th>
                                        <th className="pt-1 pb-3 px-1">Fair</th>
                                        <th className="pt-1 pb-3 px-1">Good</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <tr key={key} className="hover:bg-[#f0fbfd] transition">
                                            {/* Name */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    rules={[{ required: true, message: `${content['please']}${content['enter']}${content['name']}` }]}
                                                    className="mb-0"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </td>

                                            {/* Read - Poor */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'read_poor']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Read - Fair */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'read_fair']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Read - Good */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'read_good']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Write - Poor */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'write_poor']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Write - Fair */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'write_fair']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Write - Good */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'write_good']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Speak - Poor */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'speak_poor']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Speak - Fair */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'speak_fair']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* Speak - Good */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'speak_good']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/*  */}
                                            {/* listen - Poor */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'listen_poor']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* listen - Fair */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'listen_fair']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
                                                </Form.Item>
                                            </td>

                                            {/* listen - Good */}
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item {...restField} name={[name, 'listen_good']} className="mb-0" valuePropName="checked">
                                                    <Checkbox />
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


            <hr className='my-3 border-0' />

            <Card title="General Education">

                <Form.List name="general_education">
                    {(fields, { add, remove }) => (
                        <>
                            <table className="table-auto w-full">
                                <thead className={Styles.tHead}>
                                    <tr className='pt-3 border-b'>
                                        <th className={Styles.tHeadL}>
                                            Universities
                                        </th>
                                        <th className="px-0 py-2 text-start">Major of Study</th>
                                        <th className="px-0 py-2 text-start">Name of Supervisor</th>
                                        <th className="px-0 py-2 text-start">From Date</th>
                                        <th className="px-0 py-2 text-start">To Date</th>
                                        <th className="px-0 py-2 text-start">Degree</th>
                                        <th className={`px-0 py-2 text-start text whitespace-nowrap`}>Title Thesis</th>
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
                                                    name={[name, 'university']}
                                                    className="mb-0"

                                                >
                                                    <Input />
                                                </Form.Item>
                                            </td>
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'major']}
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
                                                    <DatePicker className="w-full" />
                                                </Form.Item>
                                            </td>

                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'end_date']}
                                                    className="mb-0"

                                                >
                                                    <DatePicker className="w-full" />
                                                </Form.Item>
                                            </td>
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'level_id']}
                                                    className="mb-0"

                                                >
                                                    <Input />
                                                </Form.Item>
                                            </td>
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'title_thesis']}
                                                    className="mb-0"

                                                >
                                                    <Input />
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


                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Education
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>
            <hr className='my-3 border-0' />
            <Card title="Training & Short Courses">
                {/* Table headers */}

                <Form.List name="short_course">
                    {(fields, { add, remove }) => (
                        <>

                            <table className="table-auto w-full">
                                <thead className={Styles.tHead}>
                                    <tr className='pt-3 border-b'>
                                        <th className={Styles.tHeadL}>
                                            Institution
                                        </th>
                                        <th className="px-0 py-2 text-start">Subject</th>
                                        <th className="px-0 py-2 text-start">From Date</th>
                                        <th className="px-0 py-2 text-start">To Date</th>
                                        <th className="px-0 py-2 text-start">Level</th>
                                        <th className={`px-0 py-2 text-start text whitespace-nowrap`}>Certificates</th>
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
                                                    name={[name, 'institution']}
                                                    className="mb-0"

                                                >
                                                    <Input />
                                                </Form.Item>
                                            </td>
                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'subject']}
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
                                                    <DatePicker className="w-full" />
                                                </Form.Item>
                                            </td>

                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'end_date']}
                                                    className="mb-0"

                                                >
                                                    <DatePicker className="w-full" />
                                                </Form.Item>
                                            </td>

                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'level_id']}
                                                    className="mb-0"

                                                >
                                                    <Input />
                                                </Form.Item>
                                            </td>

                                            <td className={`px-3 ${index === 0 ? 'pt-4' : 'pt-0'}`}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'certificate']}
                                                    className="mb-0"

                                                >
                                                    <Input />
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
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Short Course
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>

        </div>
    )
}

export default EmployeeEducationTab
