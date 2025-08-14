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
import { FileTextOutlined } from '@ant-design/icons';

import axios from 'axios';
import { Content } from 'antd/es/layout/layout';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { Styles } from '../../../utils/CsStyle';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { useParams } from 'react-router-dom';
import { getEmployeeApi } from '../../../services/employeeApi';
import AppraisalNav from './AppraisalNav';
import { getKpiApi } from '../../../services/KpiApi';
import { createAppraisalIndividualManagerMonthApi, getAppraisalIndividualManagerMonthApi, getAppraisalMonthApi, updateAppraisalIndividualManagerMonthApi } from '../../../services/AppraisalApi';

const { Title } = Typography;

export default function AppraisalMonthManagerFormPage() {
    const { mainId, id } = useParams();
    const { content, language, isLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [template, setTemplates] = useState(null);
    const [appraisal, setAppraisal] = useState(null);
    const [individual, setIndividual] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [employee, setEmployee] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        document.title = content['appraisal']
        fetchTemplates();
    }, [content]);

    const fetchTemplates = async () => {

        try {
            const resAppraisal = await getAppraisalMonthApi(id);
            setAppraisal(resAppraisal);
            const res = await getKpiApi(resAppraisal.kpiTemplate);
            setTemplates(res);
            const resEmp = await getEmployeeApi(mainId);
            setEmployee(resEmp);
            // 2. Get individual scores
            const resInd = await getAppraisalIndividualManagerMonthApi(mainId, id, resAppraisal.kpiTemplate);
            if (resInd) {
                setIndividual(resInd);

                if (resInd?.scores?.length > 0) {
                    const scoresObject = resInd.scores.reduce((acc, item) => {
                        acc[item.subId] = item.score;
                        return acc;
                    }, {});
                    form.setFieldsValue({
                        scores: scoresObject,
                        feedback: resInd.feedback || '',
                    });
                }
            }
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('');
            } else {
                console.error('Error fetching individual KPI:', error);
            }
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            setSubmitting(true);

            const values = form.getFieldsValue();

            const scoresArray = Object.entries(values.scores).map(([subId, score]) => ({
                subId,
                score: Number(score),
            }));
            const employee = mainId;
            const templateId = appraisal.kpiTemplate;
            const appraisalDay = id;
            const payload = {
                employee,
                templateId,
                appraisalDay,
                id,
                scores: scoresArray,
                feedback: values.feedback || '',
            };

            if (individual && individual._id) {
                // 🔁 Update if existing
                await updateAppraisalIndividualManagerMonthApi(individual._id, payload);
                message.success(content['updateSuccessFully']);
            } else {
                // 🆕 Create new
                await createAppraisalIndividualManagerMonthApi(payload);
                message.success(content['createSuccessFully']);
            }
            // form.resetFields();
        } catch (error) {
            if (error.errorFields) {
                // validation errors handled by antd
            } else {
                console.error(error);
                message.error(content['failedToSave']);
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
        { breadcrumbName: content['employee'], path: "/appraisal/employee" },
        { breadcrumbName: content['appraisal'], path: `/appraisal/employee/list/${mainId}` },
        { breadcrumbName: language == 'khmer' ? employee?.name_kh : employee?.name_en },
    ];

    return (
        <div>
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <AppraisalNav />
            </div>
            <div style={{
                paddingTop: 70,
                paddingBottom: 100,
                paddingLeft: 20,
                paddingRight: 20,
            }}>
                <div className="flex justify-between mb-6">
                    <h1 className='text-xl font-extrabold text-[#17a2b8]'><FileTextOutlined className='mr-2' />{content['appraisal']}</h1>
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

                                    variant="outlined"
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


                        <Card className='shadow' title={content['feedback']} style={{ marginBottom: 16 }}>
                            <Form.Item name="feedback">
                                <Input.TextArea rows={6} disabled={submitting} />
                            </Form.Item>
                            <div className="text-end">
                                <button
                                    className={Styles.btnCreate}
                                    type="submit"
                                    disabled={!template}
                                >
                                    {content['save']}
                                </button>
                            </div>
                        </Card>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
