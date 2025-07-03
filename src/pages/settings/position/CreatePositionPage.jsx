import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, message, Select } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { createPositionApi } from '../../../services/positionApi';
import { getDepartmentsApi } from '../../../services/departmentApi';

const { Option } = Select;
const { TextArea } = Input;

const CreatePositionPage = ({ form, onCancel, onUserCreated }) => {
  const { content } = useAuth();
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
      const { title, description, isActive, department } = values;
      const formData = {
        title,
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
        name="title"
        label={content['title']}
        rules={[
          {
            required: true,
            message:
              `${content['please']}${content['enter']}${content['title']}`
                .toLowerCase()
                .replace(/^./, (str) => str.toUpperCase()),
          },
        ]}
      >
        <Input size="large" />
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
        <Select placeholder="Select Department" size="large">
          {departments.map((dept) => (
            <Option key={dept._id} value={dept._id}>
              {dept.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={content['status']} name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <div className="text-end mt-3">
        <button type="button" onClick={onCancel} className={Styles.btnCancel}>
            Cancel
        </button>
        <button type="submit" className={Styles.btnCreate}>
            Save
        </button>
      </div>
    </Form>
  );
};

export default CreatePositionPage;
