import React from 'react';
import {
    Input,
    Button,
    Card,
    Divider,
    Space,
    Row,
    Col,
    DatePicker,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Styles } from '../../../utils/CsStyle';

const KpiDayForm = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    kpiItems,
    updateKpiTitle,
    deleteKpi,
    addKpi,
    submitting,
    content,
    // For nested subs if needed, can extend this later
    updateSubKpi,
    deleteSubKpi,
    addSubKpi,
}) => {
    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Start Date"
                        value={startDate ? dayjs(startDate) : null}
                        onChange={onStartDateChange}
                        disabled={submitting}
                    />
                </Col>
                <Col span={12}>
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="End Date"
                        value={endDate ? dayjs(endDate) : null}
                        onChange={onEndDateChange}
                        disabled={submitting}
                    />
                </Col>
            </Row>
            <div className="py-4"></div>
            {kpiItems.map((item, i) => (
                <Card
                    key={item._id || i}
                    title={
                        <Row justify="space-between" align="middle">
                            <Col flex="auto">
                                <Input
                                    placeholder="Main KPI Title"
                                    value={item.title}
                                    onChange={(e) => updateKpiTitle(i, e.target.value)}
                                    disabled={submitting}
                                />
                            </Col>
                            <Col className='pl-2'>
                                <button
                                    type="text"
                                    className={`cursor-pointer ${Styles.btnDelete}`}
                                    onClick={() => deleteKpi(i)}
                                    disabled={submitting}
                                >
                                    <DeleteOutlined />
                                </button>
                            </Col>
                        </Row>
                    }
                    bordered
                    style={{ marginBottom: 16 }}
                >
                    {/* If you want sub KPI inputs */}
                    {item.subs &&
                        item.subs.map((sub, j) => (
                            <Row
                                key={sub._id || j}
                                gutter={12}
                                align="middle"
                                style={{ marginBottom: 8 }}
                            >
                                <Col span={22}>
                                    <Input
                                        placeholder="Sub KPI"
                                        value={sub.title}
                                        onChange={(e) => updateSubKpi(i, j, e.target.value)}
                                        disabled={submitting}
                                    />
                                </Col>
                                <Col span={2}>
                                    <button
                                        type="text"
                                        className={`cursor-pointer ${Styles.btnDelete}`}
                                        onClick={() => deleteSubKpi(i, j)}
                                        disabled={submitting}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </Col>
                            </Row>
                        ))}

                    <Button
                        type="link"
                        className="text-default"
                        icon={<PlusOutlined />}
                        onClick={() => addSubKpi(i)}
                        disabled={submitting}
                    >
                        Add Sub KPI
                    </Button>
                </Card>
            ))}

            <Divider />

            <div className="text-end">
                <Space>
                    <button
                        className={Styles.btnLgView}
                        type="button"
                        onClick={addKpi}
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
        </>
    );
};

export default KpiDayForm;
