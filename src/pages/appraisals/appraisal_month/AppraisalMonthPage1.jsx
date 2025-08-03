import React, { useEffect, useState } from 'react';
import {
    Card,
    Input,
    Row,
    Col,
    Spin,
    Typography,
    Divider,
    Button,
    Form,
    message,
} from 'antd';
import { createKpiIndividualApi, getActiveKpiTemplatesApi } from '../../../services/KpiApi';
import axios from 'axios';
import { Content } from 'antd/es/layout/layout';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { Styles } from '../../../utils/CsStyle';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';

const { Title } = Typography;

export default function AppraisalMonthPage() {
    const { content } = useAuth();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await getActiveKpiTemplatesApi();
            setTemplates(res);
        } catch (error) {
            console.error('Error fetching KPI templates:', error);
            message.error('Failed to load KPI templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            setSubmitting(true);

            const values = form.getFieldsValue();

            if (templates.length === 0) {
                message.error('No templates to submit');
                setSubmitting(false);
                return;
            }

            const templateId = templates[0]._id;

            const scoresArray = Object.entries(values.scores).map(([subId, score]) => ({
                subId,
                score: Number(score),
            }));

            const payload = {
                templateId,
                scores: scoresArray,
                feedback: values.feedback || '',
            };

            console.log(payload);

            await createKpiIndividualApi(payload);
            // await axios.post('/api/kpi-submissions', payload);

            message.success('Scores submitted successfully');
            form.resetFields();
        } catch (error) {
            if (error.errorFields) {
                // validation errors handled by antd
            } else {
                console.error(error);
                message.error('Failed to submit scores');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['kpiMonth'] }
    ];

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h1 className='text-xl font-extrabold text-[#17a2b8]'>{content['kpiMonth']}</h1>
                <CustomBreadcrumb items={breadcrumbItems} />

            </div>
            <Card
                style={{
                    padding: 24,
                    borderRadius: 8,
                    marginTop: 10,
                }}
                title={
                    <p className='text-default text-sm font-bold mb-5'>{content['1']}. {content['kpi']}</p>
                }
            >


                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {templates.map((template, tIndex) => (
                        <div key={template._id} style={{ marginBottom: 32 }}>
                            {template.subs.map((mainKpi, i) => (
                                <Card
                                    className='shadow'
                                    key={mainKpi._id || i}
                                    title={
                                        <Row justify="space-between" align="middle">
                                            <Col flex="auto">
                                                <p>{mainKpi.title}</p>
                                            </Col>
                                        </Row>
                                    }
                                    bordered
                                    style={{ marginBottom: 16 }}
                                >
                                    {mainKpi.subs &&
                                        mainKpi.subs.map((sub, j) => (
                                            <Row
                                                key={sub._id || j}
                                                gutter={12}
                                                align="middle"
                                                style={{ marginBottom: 8 }}
                                            >
                                                <Col span={20}>
                                                    <p>{sub.title}</p>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        name={['scores', sub._id]}
                                                        rules={[
                                                            { required: true, message: 'Please input score' },
                                                            {
                                                                pattern: /^(100|[1-9][0-9]?)$/,
                                                                message: 'Score must be a number between 1 and 100',
                                                            },
                                                        ]}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={100}
                                                            placeholder="Score"
                                                            disabled={submitting}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ))}
                                </Card>
                            ))}
                        </div>
                    ))}

                    <Card className='shadow' title={content['feedback']} style={{ marginBottom: 16 }}>
                        <Form.Item name="feedback">
                            <Input.TextArea rows={6} disabled={submitting} />
                        </Form.Item>
                        <div className="text-end">
                            <button
                                className={Styles.btnCreate}
                                type="submit"
                                loading={submitting}
                                disabled={templates.length === 0}
                            >
                                Submit Scores
                            </button>
                        </div>
                    </Card>
                </Form>
            </Card>
        </div>
    );
}
