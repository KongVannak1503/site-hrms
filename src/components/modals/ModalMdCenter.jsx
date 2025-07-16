import React, { useEffect } from 'react';
import { Modal } from 'antd';

const ModalMdCenter = ({
    open,
    onCancel,
    title = 'Custom Modal',
    width = 700,
    footer,
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
            footer={footer}
            zIndex={2000}
            maskClosable={false}
            getContainer={false}
            styles={{
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                },
            }}
        >
            {children}
        </Modal>
    );
};

export default ModalMdCenter;
