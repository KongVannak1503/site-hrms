import React from 'react';
import { Drawer, Button, Space, Form } from 'antd';

const ModalXlRight = ({
    title = 'Form Drawer',
    visible,
    onClose,
    children,
}) => {
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Drawer
            title={title}
            width={1000}
            onClose={handleClose}
            open={visible}
            styles={{ body: { paddingBottom: 80 } }}
        >

            {children}
        </Drawer>
    );
};

export default ModalXlRight;
