import { Button, Card, Checkbox, DatePicker, Form, Input, message, Select } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React from 'react'
import { FaRegImages } from 'react-icons/fa';
import { Styles } from '../../utils/CsStyle';
import { useState } from 'react';
import moment from 'moment';
import { useEffect } from 'react';
import EmployeeNav from './EmployeeNav';
import { useAuth } from '../../contexts/AuthContext';
import { getEducationLevelViewApi } from '../../services/educationLevelApi';
import { createEducationApi, getEducationApi } from '../../services/employeeApi';
import { useParams } from 'react-router-dom';

const EmployeeEducationTab = () => {
    const { content } = useAuth();
    const [levels, setLevels] = useState([]);
    const [form] = Form.useForm();
    const { id } = useParams();
    const [educationId, setEducationId] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resLevel = await getEducationLevelViewApi();
                setLevels(resLevel);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content])

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getEducationApi(id);

                setEducationId(response._id || null);

                form.setFieldsValue({
                    language: response.language || [],
                    general_education: response.general_education?.map(item => ({
                        ...item,
                        start_date: item.start_date ? moment(item.start_date) : null,
                        end_date: item.end_date ? moment(item.end_date) : null,
                    })) || [],
                    short_course: response.short_course?.map(item => ({
                        ...item,
                        start_date: item.start_date ? moment(item.start_date) : null,
                        end_date: item.end_date ? moment(item.end_date) : null,
                    })) || [],
                });
            } catch (error) {
                if (error.response?.status === 404) {
                    setEducationId(null);  // no record found — new record
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

            formData.append('language', JSON.stringify(values.language || []));
            formData.append('general_education', JSON.stringify(values.general_education || []));
            formData.append('short_course', JSON.stringify(values.short_course || []));

            await createEducationApi(id, formData);
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
                {/* <Tabs
                            className='custom-tabs'
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key)}
                            items={tabItems}
                        /> */}
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
                                                            <Select
                                                                showSearch
                                                                optionFilterProp="children"
                                                                style={{ width: '100%', minWidth: 150 }}
                                                                filterOption={(input, option) =>
                                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            >
                                                                {levels.map((level) => (
                                                                    <Select.Option key={level._id || level.id} value={level._id}>
                                                                        {level.name}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
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
                                                            className="mb-0 w-[100%]"

                                                        >
                                                            <Select
                                                                showSearch
                                                                optionFilterProp="children"
                                                                style={{ width: '100%', minWidth: 150 }}
                                                                filterOption={(input, option) =>
                                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            >
                                                                {levels.map((level) => (
                                                                    <Select.Option key={level._id || level.id} value={level._id}>
                                                                        {level.name}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
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

                <div className="text-end mt-3 !bg-white !border-t !border-gray-200 px-5 py-3"
                    style={{ position: 'fixed', width: '100%', zIndex: 20, bottom: 0, right: 20 }}>
                    <button type="button" className={Styles.btnCancel}>Cancel</button>
                    <button type="submit" className={Styles.btnCreate}>Submit</button>
                </div>
            </Form>
        </div >
    )
}

export default EmployeeEducationTab
