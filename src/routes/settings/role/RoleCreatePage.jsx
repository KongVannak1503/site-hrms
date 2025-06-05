import { Checkbox, Form, Input, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { LanguageContext } from '../../../components/Translate/LanguageContext'
import { getPermissionsApi } from '../../../apis/permissionApi'
import { Styles } from '../../../components/utils/CsStyle'
import { decodeToken } from '../../../components/utils/auth'
import { createRoleApi } from '../../../apis/roleApi'

const RoleCreatePage = ({ onCancel, form }) => {
    const { content, accessToken } = useContext(LanguageContext)
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        form.resetFields(); // <- This ensures form is clean before setting new values

        const fetchData = async () => {
            try {
                const response = await getPermissionsApi();
                const initialValues = {};
                response.forEach(role => {
                    if (role.name === 'dashboard') {
                        initialValues[`actions-${role.name}`] = [...role.actions];
                    }
                });

                setPermissions(response);
                form.setFieldsValue(initialValues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);

    const decoded = decodeToken();
    console.log(decoded.id);

    const handleFinish = async (values) => {
        try {
            const roleName = values.role;
            const createdBy = decoded.id;

            const permissionsData = permissions
                .map((perm) => {
                    const selectedActions = values[`actions-${perm.name}`] || [];
                    if (selectedActions.length === 0) return null; // Skip if no actions checked

                    return {
                        permissionId: perm._id,
                        actions: selectedActions,

                    };
                })
                .filter(Boolean); // Remove nulls

            const formData = {
                name: roleName,
                permissions: permissionsData,
                createdBy: createdBy,
                isActive: true,
            };

            const response = await createRoleApi(formData);
            message.success('Role created successfully!');
            console.log('Final Submitted Data:', formData);

            // Optional: Reset form or navigate after success
            form.resetFields();

        } catch (error) {
            console.error('Error creating role:', error);
            message.error('Failed to create role');
        }
    };





    return (
        <Form
            form={form}
            layout="vertical"
            name="userForm"
            autoComplete="off"
            onFinish={handleFinish}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.length > 0 && permissions.map((role, index) => (
                    <div key={index}>
                        <h3 className='text-lg font-semibold capitalize'>{role.name}</h3>
                        <Form.Item
                            name={`actions-${role.name}`}
                            label="Actions"
                        >
                            <Checkbox.Group>
                                {role.actions.map((action, i) => (
                                    <Checkbox key={i} value={action}>{action}</Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                ))}

            </div>

            <div className="text-end">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    Cancel
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    Submit
                </button>
            </div>
        </Form>
    )
}

export default RoleCreatePage
