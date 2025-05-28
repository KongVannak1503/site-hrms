import React from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';

const { Option } = Select;

const UserCreate = ({ form }) => {
    return (
        <Form form={form} layout="vertical" name="userForm">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Username"
                        rules={[{ required: true, message: 'Please enter user name' }]}
                    >
                        <Input size="large" placeholder="Please enter user username" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[{ required: true, message: 'Please enter url' }]}
                    >
                        <Input
                            size='large'
                            addonBefore="http://"
                            addonAfter=".com"
                            placeholder="Please enter url"
                        />
                    </Form.Item>
                </Col>
            </Row>
            {/* Add more fields as needed */}
        </Form>
    );
};

export default UserCreate;
