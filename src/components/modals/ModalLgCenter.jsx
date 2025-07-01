import React, { useEffect } from 'react';
import { Modal } from 'antd';

const ModalLgCenter = ({
    open,
    onCancel,
    title = 'Custom Modal',
    width = 1000,
    children,
}) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);
    return (
        <Modal
            title={title}
            centered
            open={open}
            onCancel={onCancel}
            width={width}
            footer={null}
            zIndex={2000}
            getContainer={false}
            maskClosable={false}
            styles={{
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
            }}
        >
            {children}
        </Modal>
    );
};

export default ModalLgCenter;
