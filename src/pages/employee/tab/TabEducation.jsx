import { Button, Card, Checkbox, DatePicker, Form, Input, message, Select } from 'antd'
import { PlusOutlined, MinusCircleOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons';
import React from 'react'
import { useState } from 'react';
import moment from 'moment';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { createEducationApi, getEducationApi, getLanguagesApi } from '../../../services/employeeApi';
import { getEducationLevelViewApi } from '../../../services/educationLevelApi';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';

const TabEducation = () => {
    const { content } = useAuth();
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [actionForm, setActionForm] = useState('create');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const closeDrawer = async () => {
        setOpen(false);
        refreshLanguages();
    };

    const refreshLanguages = async () => {
        try {
            const resLanguages = await getLanguagesApi();
            setLanguages(resLanguages);
        } catch (error) {
            console.error("Failed to fetch languages:", error);
        }
    };

    const showCreateDrawer = (create = '', id = '') => {
        if (create == 'create') {
            setOpen(true);
            setActionForm('create');
        } if (create == 'update') {
            setOpen(true);
            setSelectedUserId(id);
            setActionForm('update');
        }

    };

    const { id } = useParams();
    const [educationId, setEducationId] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resLevel = await getEducationLevelViewApi();
                setLevels(resLevel);

                const resLanguages = await getLanguagesApi();
                setLanguages(resLanguages);

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
                    vocational_training: response.vocational_training?.map(item => ({
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

    return (
        <div className="flex flex-col">
            <Form
                form={form}
                disabled={true}
                layout="vertical"
                autoComplete="off"
            >
                <div>
                    <Card title={<p className='text-default text-sm font-bold'>{content['foreignLanguages']}</p>} className="overflow-x-auto">
                        <Form.List name="language">
                            {(fields) => (
                                <>
                                    <table className="table-auto w-full">
                                        <thead className="bg-[#002060] text-left text-gray-200 font-semibold rounded-t-md">
                                            <tr className='pt-3 border-b'>
                                                <th rowSpan={2} className="min-w-[150px] px-3 py-2 text-center first:rounded-tl-md last:rounded-tr-md">
                                                    {content['languages']}
                                                </th>
                                                <th colSpan={3} className="px-3 py-2 text-center">{content['read']}</th>
                                                <th colSpan={3} className="px-3 py-2 text-center">{content['write']}</th>
                                                <th colSpan={3} className="px-3 py-2 text-center">{content['speak']}</th>
                                                <th colSpan={3} className="px-3 py-2 text-center px-3 py-2 w-12 first:rounded-tl-md last:rounded-tr-md">{content['listen']}</th>
                                                {/* <th rowSpan={2} className="px-3 py-2 w-12 first:rounded-tl-md last:rounded-tr-md"></th> */}
                                            </tr>
                                            <tr className="text-center bg-[#002060]">
                                                <th className="pt-1 pb-3 px-1">{content['poor']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['fair']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['good']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['poor']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['fair']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['good']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['poor']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['fair']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['good']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['poor']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['fair']}</th>
                                                <th className="pt-1 pb-3 px-1">{content['good']}</th>
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
                                                            <Select
                                                                showSearch
                                                                disabled
                                                                optionFilterProp="children"
                                                                style={{ width: '100%' }}
                                                                filterOption={(input, option) =>
                                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                                }
                                                                value={restField?.value?.name}
                                                                onChange={(value) => restField?.onChange?.({ ...restField.value, name: value })}
                                                            >
                                                                {languages.map((language) => (
                                                                    <Select.Option key={language._id} value={language._id}>
                                                                        <div className="flex justify-between items-center">
                                                                            <span>{language.name_kh}</span>
                                                                        </div>
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </Form.List>
                    </Card>
                </div>
            </Form>

        </div >
    )
}

export default TabEducation
