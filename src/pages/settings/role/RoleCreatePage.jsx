import { Checkbox, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { getPermissionsApi } from '../../../services/permissionApi'
import { createRoleApi, existNameRoleApi } from '../../../services/roleApi'
import { Styles } from '../../../utils/CsStyle'
import { useAuth } from '../../../contexts/AuthContext'

const RoleCreatePage = ({ onCancel, form, onUserCreated }) => {
    const { content } = useAuth();
    const [permissions, setPermissions] = useState([]);
    const [roleNameError, setRoleNameError] = useState('');

    useEffect(() => {
        form.resetFields();

        const fetchData = async () => {
            try {
                const response = await getPermissionsApi();
                const initialValues = {};

                // Ensure response is an array and contains valid data
                const permissionsData = Array.isArray(response) ? response : [];

                setPermissions(permissionsData);
                form.setFieldsValue(initialValues);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPermissions([]); // Set empty array on error
                message.error('Failed to load permissions');
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
                // name: roleName,
                role: role,
                permissions: permissionsData,
                isActive: true,
            };

            const response = await createRoleApi(formData);
            message.success(content['createSuccessFully']);
            onUserCreated(response.data);

            // Optional: Reset form or navigate after success
            form.resetFields();

        } catch (error) {
            console.error('Error creating role:', error);
            message.error(content['failedToCreate']);
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
                {/* <Form.Item
                    label={content['name']}
                >
                    <Input value={roleName} disabled />
                </Form.Item> */}
                <Form.Item
                    name="role"
                    label={content['role']}

                    // validateStatus={roleNameError ? 'error' : ''}
                    rules={[{
                        required: true,
                        message: `${content['please']}${content['enter']}${content['role']}`
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase())
                    }]}
                >
                    <Input />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1">
                {Array.isArray(permissions) && permissions.length > 0 ? (
                    permissions
                        .filter(perm => perm && perm.name && Array.isArray(perm.actions))
                        .map((perm, index) => (
                            <div key={perm._id || index}>
                                <h3 className='text-lg font-semibold capitalize mb-2'>{perm.name}</h3>
                                <Form.Item
                                    name={`actions-${perm.name}`}
                                >
                                    <Checkbox.Group>
                                        {perm.actions.map((action, i) => (
                                            <div className="mb-3" key={i}>
                                                <Checkbox value={action}>{action}</Checkbox>
                                            </div>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No permissions available
                    </div>
                )}
            </div>

            <div className="text-end">
                <button type="button" onClick={onCancel} className={Styles.btnCancel}>
                    {content['cancel']}
                </button>
                <button type="submit" className={Styles.btnCreate} >
                    {content['save']}
                </button>
            </div>
        </Form >
    )
}

export default RoleCreatePage
