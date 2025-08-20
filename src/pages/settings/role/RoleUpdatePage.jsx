import { Checkbox, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { getRoleApi, updateRoleApi } from '../../../services/roleApi';
import { getPermissionsApi } from '../../../services/permissionApi';

const RoleUpdatePage = ({ roleId, onCancel, onUserUpdated }) => {
    const { content } = useAuth();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [currentRoleName, setCurrentRoleName] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch all permissions and the role data in parallel
                const [permResponse, roleResponse] = await Promise.all([
                    getPermissionsApi(),
                    getRoleApi(roleId)
                ]);


                setPermissions(permResponse);

                // Prepare initial form values
                const initialValues = {
                    role: roleResponse.role
                };

                // Populate permission actions in form initial values
                roleResponse.permissions.forEach(rolePerm => {
                    const key = `actions-${rolePerm.permissionId?._id || rolePerm.permissionId}`;
                    initialValues[key] = rolePerm.actions;
                });

                form.setFieldsValue(initialValues);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                message.error('Failed to load role data');
            }
        };

        fetchInitialData();

    }, [roleId, form]);

    const handleFinish = async (values) => {
        try {

            const permissionsData = permissions
                .map((perm) => {
                    const selectedActions = values[`actions-${perm._id}`] || [];
                    if (selectedActions.length === 0) return null;

                    return {
                        permissionId: perm._id,
                        actions: selectedActions,
                        isActive: true,
                    };
                })
                .filter(Boolean);

            const formData = {
                role: values.role,
                permissions: permissionsData
            };

            const response = await updateRoleApi(roleId, formData);
            message.success(content['createSuccessFully']);
            onUserUpdated(response.data);
        } catch (error) {
            console.error('❌ Error updating role:', error);
            message.error(content['failedToUpdate']);
        }
    };

    // Don't render form until loading is complete
    if (loading) return <FullScreenLoader />;

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
                    label={content['name']}

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.map((perm) => (
                    <div key={perm._id}>
                        <h3 className="text-lg font-semibold capitalize">{perm.name}</h3>
                        <Form.Item name={`actions-${perm._id}`}>
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
                    {content['cancel']}
                </button>
                <button type="submit" className={Styles.btnCreate}>
                    {content['save']}
                </button>
            </div>
        </Form>
    );
};

export default RoleUpdatePage;
