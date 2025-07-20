import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, message, Select } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { createPositionApi } from '../../../services/positionApi';
import { getDepartmentsApi } from '../../../services/departmentApi';

const { Option } = Select;
const { TextArea } = Input;

const CreatePositionPage = ({ form, onCancel, onUserCreated }) => {
  const { content, language } = useAuth();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    form.resetFields();
    const loadDepartments = async () => {
      try {
        const res = await getDepartmentsApi();
        setDepartments(res);
      } catch (err) {
        console.error('Failed to load departments:', err);
        message.error('Could not load departments');
      }
    };
    loadDepartments();
  }, [content, form]);

  const handleFinish = async (values) => {
    try {
      const { title_en, title_kh, description, isActive, department } = values;
      const formData = {
        title_en, title_kh,
        description,
        isActive,
        department,
      };

      const response = await createPositionApi(formData);
      message.success(content['createSuccess'] || 'Created successfully!');
      onUserCreated(response.data);
      form.resetFields();
    } catch (error) {
      console.error('Error creating Position:', error);
      message.error(content['createFailed'] || 'Failed to create Position');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      autoComplete="off"
      initialValues={{
        isActive: true,
      }}
    >
      <Form.Item
        name="title_kh"
        label={content['titleKh']}
        rules={[
          {
            required: true,
            message:
              `${content['please']}${content['enter']}${content['titleKh']}`
                .toLowerCase()
                .replace(/^./, (str) => str.toUpperCase()),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="title_en"
        label={content['titleEn']}
        rules={[
          {
            required: true,
            message:
              `${content['please']}${content['enter']}${content['titleEn']}`
                .toLowerCase()
                .replace(/^./, (str) => str.toUpperCase()),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label={content['description']}
        rules={[
          {
            required: false,
          },
        ]}
      >
        <TextArea rows={4} placeholder="Enter description..." />
      </Form.Item>

      <Form.Item
        name="department"
        label={content['department']}
        rules={[
          {
            required: true,
            message:
              `${content['please']}${content['select']}${content['department']}`
                .toLowerCase()
                .replace(/^./, (str) => str.toUpperCase()),
          },
        ]}
      >
        <Select placeholder="Select Department" >
          {departments.map((dept) => (
            <Option key={dept._id} value={dept._id}>
              {language == 'khmer' ? dept.title_kh : dept.title_en}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={content['status']} name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <div className="text-end mt-3">
        <button type="button" onClick={onCancel} className={Styles.btnCancel}>
          {content['cancel']}
        </button>
        <button type="submit" className={Styles.btnCreate}>
          {content['save']}
        </button>
      </div>
    </Form>
  );
};

export default CreatePositionPage;
