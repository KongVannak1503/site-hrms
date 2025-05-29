import React from 'react';
import { Drawer, Button, Space, Form } from 'antd';

const ModalLgRight = ({
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
            width={720}
            onClose={handleClose}
            open={visible}
            styles={{ body: { paddingBottom: 80 } }}
        // Remove the extra buttons from here
        // extra={...} 
        >

            {children}
        </Drawer>
    );
};

export default ModalLgRight;
