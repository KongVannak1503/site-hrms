import React, { useState } from 'react';
import {
    Input,
    Button,
    Card,
    Form,
    Typography,
    Space,
    Divider,
    DatePicker,
    message,
    Row,
    Col,
} from 'antd';
import { DeleteOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import CustomBreadcrumb from '../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../contexts/AuthContext';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../utils/CsStyle';
import dayjs from 'dayjs';
import { createKpiApi } from '../../services/KpiApi';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function KpiTemplateBuilder() {
    const { content } = useAuth();
    const [kpiItems, setKpiItems] = useState([]);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [name, setName] = useState(null);
    const navigate = useNavigate();
    const addMainKpi = () => {
        setKpiItems(prev => [...prev, { title: '', subs: [] }]);
    };

    const updateMainKpi = (index, value) => {
        setKpiItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], title: value };
            return updated;
        });
    };

    const deleteMainKpi = (index) => {
        setKpiItems(prev => prev.filter((_, i) => i !== index));
    };

    const addSubKpi = (index) => {
        setKpiItems(prev => {
            const updated = [...prev];
            const main = { ...updated[index] };
            main.subs = [...main.subs, { title: '' }];
            updated[index] = main;
            return updated;
        });
    };

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
            const subs = updated[mainIdx].subs.filter((_, i) => i !== subIdx);
            updated[mainIdx] = { ...updated[mainIdx], subs };
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            message.warning('Please complete the title and date range.');
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

        const payload = {
            subs: kpiItems,
            name,
        };

        console.log('KPI Template:', payload);
        const response = await createKpiApi(payload);
        message.success(content['createSuccessFully']);
        setTitle('');
        setName(null);
        setKpiItems([]);
        navigate(`/appraisal/kpi`);
    };

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['kpi'], path: '/appraisal/kpi' },
        { breadcrumbName: content['create'] || 'Form' },
    ];

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
                className="border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{ borderRadius: 8, marginTop: 10 }}
            >
                <Form layout="vertical" onSubmitCapture={handleSubmit}>

                    <Row gutter={16} >
                        <Col span={24}>
                            <Form.Item label={content['name']} required>
                                <Input
                                    placeholder={`${content['enter']}${content['name']}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="py-1"></div>
                    {kpiItems.map((item, i) => (
                        <Card
                            key={`main-kpi-${i}`}
                            title={
                                <Row justify="space-between" align="middle">
                                    <Col flex="auto">
                                        <Input
                                            placeholder={content['title']}
                                            value={item.title}
                                            onChange={(e) => updateMainKpi(i, e.target.value)}
                                        />
                                    </Col>
                                    <Col className="pl-2">
                                        <button
                                            type="button"
                                            onClick={() => deleteMainKpi(i)}
                                            className={Styles.btnDelete}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Col>
                                </Row>
                            }
                            bordered
                            style={{ marginBottom: 16 }}
                        >
                            {item.subs.map((sub, j) => (
                                <Row
                                    className="px-5"
                                    key={`sub-kpi-${i}-${j}`}
                                    gutter={12}
                                    align="middle"
                                    style={{ marginBottom: 8 }}
                                >
                                    <Col span={22}>
                                        <Input
                                            placeholder="Sub KPI"
                                            value={sub.title}
                                            onChange={(e) => updateSubKpi(i, j, e.target.value)}
                                        />
                                    </Col>
                                    <Col span={2}>
                                        <button
                                            type="button"
                                            onClick={() => deleteSubKpi(i, j)}
                                            className={Styles.btnDelete}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Col>
                                </Row>
                            ))}
                            <Button
                                className="text-default"
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => addSubKpi(i)}
                            >
                                {content['addSubKpi'] || 'Add Sub KPI'}
                            </Button>
                        </Card>
                    ))}

                    <Divider />

                    <div className="text-end">
                        <Space >
                            <button
                                className={Styles.btnLgView}
                                type="button"
                                onClick={addMainKpi}
                            >
                                <PlusOutlined /> {content['add'] || 'Add'}
                            </button>
                            <button
                                className={Styles.btnCreate}
                                type="submit"
                            >
                                {content['save'] || 'Save'}
                            </button>
                        </Space>
                    </div>
                </Form>
            </Content>
        </div>
    );
}

export default KpiTemplateBuilder;
