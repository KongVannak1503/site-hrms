import { Checkbox, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { getPermissionsApi } from '../../../services/permissionApi'
import { createRoleApi, existNameRoleApi } from '../../../services/roleApi'
import { Styles } from '../../../utils/CsStyle'
import { useAuth } from '../../../contexts/AuthContext'

const RoleCreatePage = ({ onCancel, form, onUserCreated, roleName }) => {
    const { content } = useAuth();
    const [permissions, setPermissions] = useState([]);
    const [roleNameError, setRoleNameError] = useState('');

    useEffect(() => {
        form.resetFields();

        const fetchData = async () => {
            try {
                const response = await getPermissionsApi();
                const initialValues = {};
                if (roleName) {
                    response.forEach((perm) => {
                        // Only assign actions that this role is allowed to have
                        // const availableToRole = perm.roles.includes(roleName);
                        initialValues[`actions-${perm.name}`] = []; // show permission but not checked

                    });
                }

                setPermissions(response);
                form.setFieldsValue(initialValues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [content]);


    const handleRoleNameChange = async (e) => {
        const roleName = e.target.value;
        if (roleName) {
            try {
                const response = await existNameRoleApi(roleName);
                if (response.exists) {
                    setRoleNameError('This role name already exists');
                } else {
                    setRoleNameError('');
                }
            } catch (error) {
                setRoleNameError('Error checking role name');
                console.error('Error:', error);
            }
        } else {
            setRoleNameError('');
        }
    };

    const handleFinish = async (values) => {
        try {
            const role = values.role;

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
                role: role,
                permissions: permissionsData,
                isActive: true,
            };

            const response = await createRoleApi(formData);
            message.success('Role created successfully!');
            onUserCreated(response.data);

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
                    label={content['name']}
                >
                    <Input value={roleName} disabled />
                </Form.Item>
                <Form.Item
                    name="role"
                    label={content['role']}

                    validateStatus={roleNameError ? 'error' : ''}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['role']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input onChange={handleRoleNameChange} />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.length > 0 && permissions
                    .filter((perm) => perm.roles.includes(roleName)) // only show permissions allowed for this role
                    .map((perm, index) => (
                        <div key={index}>
                            <h3 className='text-lg font-semibold capitalize'>{perm.name}</h3>
                            <Form.Item
                                name={`actions-${perm.name}`}
                                label="Actions"
                            >
                                <Checkbox.Group>
                                    {perm.actions.map((action, i) => (
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
