import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { Styles } from '../../../components/utils/CsStyle';

const UserCreate = ({ form, onCancel }) => {
    return (
        <Form
            form={form}
            layout="vertical"
            name="userForm"
            autoComplete="off"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please enter username' }]}
                    >
                        <Input size="large" placeholder="Enter username" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="url"
                        label="Website URL"
                        rules={[{ required: true, message: 'Please enter URL' }]}
                    >
                        <Input
                            size="large"
                            addonBefore="http://"
                            addonAfter=".com"
                            placeholder="Enter website URL"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <div className="text-end">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </Form>
    );
};

export default UserCreate;
