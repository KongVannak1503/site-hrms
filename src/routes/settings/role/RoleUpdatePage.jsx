import { Checkbox, Form, Input, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../components/Translate/LanguageContext';
import { getPermissionsApi } from '../../../apis/permissionApi';
import { Styles } from '../../../components/utils/CsStyle';
import { decodeToken } from '../../../components/utils/auth';
import { getRoleApi, updateRoleApi } from '../../../apis/roleApi';

const RoleUpdatePage = ({ roleId, onCancel }) => {
    const { content } = useContext(LanguageContext);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [permResponse, roleResponse] = await Promise.all([
                    getPermissionsApi(),
                    getRoleApi(roleId)
                ]);

                setPermissions(permResponse); // Save all available permissions

                const initialValues = {
                    role: roleResponse.name
                };

                // Assign permission actions to initial form values
                roleResponse.permissions.forEach(rolePerm => {
                    const key = `actions-${rolePerm.permissionId?._id || rolePerm.permissionId}`;
                    initialValues[key] = rolePerm.actions;
                });

                console.log("✅ Initial Values Set:", initialValues);
                form.setFieldsValue(initialValues);
                setLoading(false);
            } catch (error) {
                console.error('❌ Error fetching initial data:', error);
                message.error('Failed to load role data');
            }
        };

        fetchInitialData();
    }, [roleId]);

    const decoded = decodeToken();

    const handleFinish = async (values) => {
        try {
            const roleName = values.role;
            const updatedBy = decoded.id;

            const permissionsData = permissions
                .map((perm) => {
                    const selectedActions = values[`actions-${perm._id}`] || [];
                    if (selectedActions.length === 0) return null;

                    return {
                        permissionId: perm._id,
                        actions: selectedActions,
                        isActive: true,
                        updatedBy: [updatedBy]
                    };
                })
                .filter(Boolean);

            const formData = {
                name: roleName,
                permissions: permissionsData
            };

            await updateRoleApi(roleId, formData);
            message.success('✅ Role updated successfully!');
            form.resetFields();
        } catch (error) {
            console.error('❌ Error updating role:', error);
            message.error('Failed to update role');
        }
    };

    // ✅ Don't render form until loading is complete
    if (loading) return <div>Loading role data...</div>;

    return (
        <Form
            form={form}
            layout="vertical"
            name="roleUpdateForm"
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
                {permissions.map((perm) => (
                    <div key={perm._id}>
                        <h3 className="text-lg font-semibold capitalize">{perm.name}</h3>
                        <Form.Item name={`actions-${perm._id}`} label="Actions">
                            <Checkbox.Group>
                                {perm.actions.map((action) => (
                                    <Checkbox key={action} value={action}>{action}</Checkbox>
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
                <button type="submit" className={Styles.btnCreate}>
                    Update
                </button>
            </div>
        </Form>
    );
};

export default RoleUpdatePage;
