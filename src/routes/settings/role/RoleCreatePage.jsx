import { Form, Input } from 'antd'
import React, { useContext } from 'react'
import { LanguageContext } from '../../../components/Translate/LanguageContext'

const RoleCreatePage = () => {
    const { content } = useContext(LanguageContext)
    return (
        <Form
            // form={form}
            layout="vertical"
            name="userForm"
            autoComplete="off"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    name="role"
                    label={content['role']}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['role']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input size="large" />
                </Form.Item>
            </div>
        </Form>
    )
}

export default RoleCreatePage
