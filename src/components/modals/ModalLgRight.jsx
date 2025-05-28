import React from 'react';
import { Drawer, Button, Space, Form } from 'antd';

const ModalLgRight = ({
    title = 'Form Drawer',
    visible,
    onClose,
    onSubmit,
    children,
}) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
        form.resetFields();
    };

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
            bodyStyle={{ paddingBottom: 80 }}
        // Remove the extra buttons from here
        // extra={...} 
        >
            <Form
                form={form}
                layout="vertical"
                hideRequiredMark
                onFinish={handleFinish}
            >
                {children}

                {/* Add buttons inside the form */}

            </Form>
        </Drawer>
    );
};

export default ModalLgRight;
