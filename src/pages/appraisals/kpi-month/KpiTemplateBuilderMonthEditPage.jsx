import React, { useState, useEffect } from 'react';
import { Form, message, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { Content } from 'antd/es/layout/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { getMonthKpiApi, updateMonthKpiApi } from '../../../services/KpiApi';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import KpiMonthForm from './KpiMonthForm';

function KpiTemplateBuilderMonthEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { content } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [kpiItems, setKpiItems] = useState([]);
    const location = useLocation();

    useEffect(() => {
        async function fetchKpi() {
            try {
                const res = await getMonthKpiApi(id);
                const data = res?.data || res || {};

                setStartDate(data.startDate ? dayjs(data.startDate).toISOString() : null);
                setEndDate(data.endDate ? dayjs(data.endDate).toISOString() : null);
                setKpiItems(data.subs || []);
            } catch (error) {
                message.error('Failed to load KPI Template');
            } finally {
                setLoading(false);
            }
        }

        fetchKpi();
    }, [id]);

    useEffect(() => {
        if (location.state?.successMessage) {
            setTimeout(() => {
                message.success(location.state.successMessage);
                navigate(location.pathname, { replace: true });
            }, 0);
        }
    }, [location.state, navigate, location.pathname]);

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

        if (!startDate || !endDate) {
            message.warning('Please complete the date range.');
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
                startDate,
                endDate,
            };

            await updateMonthKpiApi(id, payload);
            message.success(content['updateSuccess']);
        } catch (error) {
            message.error(content['failedToUpdate']);
        } finally {
            setSubmitting(false);
        }
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['kpiMonth'], path: '/appraisal/kpi/month' },
        { breadcrumbName: `${content['edit']}${content['kpi']}` || 'Edit KPI' },
    ];

    if (loading) {
        return <FullScreenLoader />;
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
                    <KpiMonthForm
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={(date) => setStartDate(date ? date.toISOString() : null)}
                        onEndDateChange={(date) => setEndDate(date ? date.toISOString() : null)}
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

export default KpiTemplateBuilderMonthEditPage;
