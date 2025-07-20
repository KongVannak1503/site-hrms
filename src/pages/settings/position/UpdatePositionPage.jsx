import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, message, Select } from 'antd';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import { getPositionApi, updatePositionApi } from '../../../services/positionApi';
import { getDepartmentsApi } from '../../../services/departmentApi';

const { Option } = Select;
const { TextArea } = Input;

const UpdatePositionPage = ({ dataId, onCancel, onUserUpdated }) => {
  const { content, language } = useAuth();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [positionRes, deptRes] = await Promise.all([
          getPositionApi(dataId),
          getDepartmentsApi(),
        ]);

        setDepartments(deptRes);

        form.setFieldsValue({
          title_en: positionRes.title_en,
          title_kh: positionRes.title_kh,
          description: positionRes.description,
          department: positionRes.department?._id || positionRes.department,
          isActive: positionRes.isActive,
        });
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load data');
      }
    };

    fetchInitialData();
  }, [dataId, form]);

  const handleFinish = async (values) => {
    try {
      const formData = {
        title_en: values.title_en,
        title_kh: values.title_kh,
        description: values.description,
        department: values.department,
        isActive: values.isActive,
      };

      const response = await updatePositionApi(dataId, formData);
      message.success('Updated successfully!');
      onUserUpdated(response.data);
    } catch (error) {
      console.error('Error updating position:', error);
      message.error('Failed to update');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      autoComplete="off"
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
        rules={[{ required: false }]}
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
        <Select placeholder="Select Department">
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
          Cancel
        </button>
        <button type="submit" className={Styles.btnUpdate}>
          Update
        </button>
      </div>
    </Form>
  );
};

export default UpdatePositionPage;
