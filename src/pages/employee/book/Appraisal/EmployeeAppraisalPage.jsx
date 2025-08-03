import React, { useEffect, useState } from 'react';
import {
    Card,
    Input,
    Row,
    Col,
    Spin,
    Typography,
    Form,
    message,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons';
import { useAuth } from '../../../../contexts/AuthContext';
import { getKpiIndividualThisMonthApi } from '../../../../services/KpiApi';
import CustomBreadcrumb from '../../../../components/breadcrumb/CustomBreadcrumb';
import { useParams } from 'react-router-dom';
import EmployeeNav from '../../EmployeeNav';
import FullScreenLoader from '../../../../components/loading/FullScreenLoader';

const { Title } = Typography;

export default function EmployeeAppraisalPage() {
    const { id } = useParams();
    const { content } = useAuth();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState(null); // changed to null instead of []
    const [form] = Form.useForm();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await getKpiIndividualThisMonthApi(id);
            setTemplate(res); // response is an object, not an array
        } catch (error) {
            console.error('Error fetching KPI template:', error);
            // message.error('Failed to load KPI template');
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['kpiMonth'] }
    ];

    if (loading) return <FullScreenLoader />;

    if (!template || !template.templateId) {
        return <div className="flex flex-col">
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <EmployeeNav />
            </div>
            <div style={{
                paddingTop: 70,
                paddingBottom: 100,
                paddingLeft: 20,
                paddingRight: 20,
            }}>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeInfo']}</p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>

                <Card
                    style={{
                        padding: 24,
                        borderRadius: 8,
                        marginTop: 10,
                    }}
                    title={
                        <p className='text-default text-sm font-bold mb-5'>
                            {content['1']}. {content['kpi']}
                        </p>
                    }
                >Data not found!</Card>
            </div>
        </div>
    }

    return (
        <div className="flex flex-col">
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <EmployeeNav />
            </div>
            <div style={{
                paddingTop: 70,
                paddingBottom: 100,
                paddingLeft: 20,
                paddingRight: 20,
            }}>
                <div className="mb-3 flex justify-between">
                    <p className='text-default font-extrabold text-xl'><FileTextOutlined className='mr-2' />{content['employeeInfo']}</p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>

                <Card
                    style={{
                        padding: 24,
                        borderRadius: 8,
                        marginTop: 10,
                    }}
                    title={
                        <p className='text-default text-sm font-bold mb-5'>
                            {content['1']}. {content['kpi']}
                        </p>
                    }
                >
                    <Form form={form}
                        layout="vertical">
                        {template.templateId.subs.map((mainKpi, i) => (
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
                                {mainKpi.subs.map((sub, j) => {
                                    const scoreObj = template.scores.find(s => s.subId === sub._id);
                                    return (
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
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    value={scoreObj?.score}
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                    );
                                })}
                            </Card>
                        ))}

                        <Card className='shadow' title={content['feedback']} style={{ marginBottom: 16 }}>
                            <p>
                                {template.feedback}
                            </p>
                        </Card>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
