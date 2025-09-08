import React, { useState, useEffect } from 'react';
import { Form, message, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import CustomBreadcrumb from '../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../contexts/AuthContext';
import { Content } from 'antd/es/layout/layout';
import { getKpiApi, updateKpiApi } from '../../services/KpiApi';
import KpiForm from './KpiForm';

function KpiTemplateBuilderEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { content } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(null);
    const [kpiItems, setKpiItems] = useState([]);

    useEffect(() => {
        async function fetchKpi() {
            try {
                const res = await getKpiApi(id);
                const data = res?.data || res || {};

                setName(data.name ? data.name : null);
                setKpiItems(data.subs || []);
            } catch (error) {
                message.error('Failed to load KPI Template');
            } finally {
                setLoading(false);
            }
        }

        fetchKpi();
    }, [id]);

    const updateKpiTitle = (index, value) => {
        setKpiItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], title: value };
            return updated;
        });
    };

    const deleteKpi = (index) => {
        setKpiItems(prev => prev.filter((_, i) => i !== index));
    };

    const addKpi = () => {
        setKpiItems(prev => [...prev, { title: '', subs: [] }]);
    };

    // For subs (optional, only if you want to support nested KPI)
    const updateSubKpi = (mainIdx, subIdx, value) => {
        setKpiItems(prev => {
            const updated = [...prev];
            const subs = [...updated[mainIdx].subs];
            subs[subIdx] = { ...subs[subIdx], title: value };
            updated[mainIdx] = { ...updated[mainIdx], subs };
            return updated;
        });
    };

    const deleteSubKpi = (mainIdx, subIdx) => {
        setKpiItems(prev => {
            const updated = [...prev];
            updated[mainIdx].subs = updated[mainIdx].subs.filter((_, i) => i !== subIdx);
            return updated;
        });
    };

    const addSubKpi = (mainIdx) => {
        setKpiItems(prev => {
            const updated = [...prev];
            updated[mainIdx].subs = [...(updated[mainIdx].subs || []), { title: '' }];
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            message.warning('Please input name.');
            return;
        }

        if (kpiItems.length === 0) {
            message.warning('Please add at least one KPI.');
            return;
        }

        for (let i = 0; i < kpiItems.length; i++) {
            const main = kpiItems[i];
            if (!main.title.trim()) {
                message.warning(`Main KPI #${i + 1} is required.`);
                return;
            }
            for (let j = 0; j < (main.subs || []).length; j++) {
                if (!main.subs[j].title.trim()) {
                    message.warning(`Sub KPI #${j + 1} in Main KPI #${i + 1} is required.`);
                    return;
                }
            }
        }

        setSubmitting(true);

        try {
            const payload = {
                subs: kpiItems,
                name,
            };

            await updateKpiApi(id, payload);
            message.success(content['updateSuccessFully']);
        } catch (error) {
            message.error(content['failedToUpdate']);
        } finally {
            setSubmitting(false);
        }
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['kpi'], path: '/appraisal/kpi' },
        { breadcrumbName: content['edit'] || 'Edit KPI' },
    ];

    if (loading) {
        return <Spin tip="Loading..." style={{ display: 'block', marginTop: 100, textAlign: 'center' }} />;
    }

    return (
        <div>
            <div className="mb-3 flex justify-between">
                <p className="text-default font-extrabold text-xl">
                    <FileTextOutlined className="mr-2" />
                    {content['kpi'] || 'KPI'}
                </p>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>

            <Content
                className="border border-gray-200 bg-white p-5 md:p-6"
                style={{ borderRadius: 8, marginTop: 10 }}
            >
                <Form layout="vertical" onSubmitCapture={handleSubmit}>
                    <KpiForm
                        setName={setName}
                        name={name}
                        kpiItems={kpiItems}
                        updateKpiTitle={updateKpiTitle}
                        deleteKpi={deleteKpi}
                        addKpi={addKpi}
                        updateSubKpi={updateSubKpi}
                        deleteSubKpi={deleteSubKpi}
                        addSubKpi={addSubKpi}
                        submitting={submitting}
                        content={content}
                    />
                </Form>
            </Content>
        </div>
    );
}

export default KpiTemplateBuilderEditPage;
