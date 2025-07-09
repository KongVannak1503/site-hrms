import { Form, Input } from 'antd'
import React from 'react'

const LanguagePage = ({ content }) => {
    return (
        <div>
            <Form.Item
                name="name_en"
                label={content['title']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['title']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="name_kh"
                label={content['title']}
                rules={[{
                    required: true,
                    message: `${content['please']}${content['enter']}${content['title']}`
                        .toLowerCase()
                        .replace(/^./, str => str.toUpperCase())
                }]}
            >
                <Input />
            </Form.Item>
        </div>
    )
}

export default LanguagePage
