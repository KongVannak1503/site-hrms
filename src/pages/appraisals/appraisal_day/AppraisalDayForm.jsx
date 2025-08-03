// components/forms/AppraisalDayForm.js
import React from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Styles } from '../../../utils/CsStyle';

const AppraisalDayForm = ({
    content,
    language,
    departments = [],
    templates = [],
    onCancel,
}) => {
    return (
        <>
            <Form.Item
                name="startDate"
                label={content['date'] || 'Date'}
                rules={[{ required: true, message: 'Please select a start date' }]}
            >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="department"
                label={content['department']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['department']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    <Select.Option value='all'>
                        {language === 'khmer' ? 'ទាំងអស់' : 'All'}
                    </Select.Option>
                    {departments.map((department) => (
                        <Select.Option key={department._id || department.id} value={department._id}>
                            {language === 'khmer' ? department.title_kh : department.title_en}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="kpiTemplate"
                label={content['kpi']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['kpi']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {templates.map((template) => (
                        <Select.Option key={template._id || template.id} value={template._id}>
                            {template.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <div className="text-end mt-3">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </>
    );
};

export default AppraisalDayForm;
