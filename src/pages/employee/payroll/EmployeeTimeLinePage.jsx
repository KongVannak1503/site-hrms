import React, { useEffect, useState } from 'react';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Timeline, Card } from 'antd';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import EmployeeNav from '../EmployeeNav';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { getEmployeeApi } from '../../../services/employeeApi';

import '../../../CustomList.css'
import { formatDate, formatYear } from '../../../utils/utils';

const EmployeeTimeLinePage = () => {
    const { content, language } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        document.title = `${content['seniorityPayment']} | USEA`;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getEmployeeApi(id);
                setEmployee(response);
            } catch (error) {
                console.error('Error fetching data:', error);
                setEmployee(null);
            }
            setLoading(false);
        };
        fetchData();
    }, [content, language, id]);

    if (loading) return <div>Loading...</div>;
    if (!employee) return <div>No employee data found.</div>;

    // Sort bonuses descending by payDate (newest first)
    const sortedBonuses = (employee.subBonus || []).slice().sort((a, b) => {
        const dateA = new Date(a.bonusId?.payDate);
        const dateB = new Date(b.bonusId?.payDate);
        return dateB - dateA; // descending order
    });

    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['employee'], path: '/employee' },
        { breadcrumbName: content['seniorityPayment'] },
    ];

    return (
        <>
            <div
                className="employee-tab-bar !bg-white !border-b !border-gray-200 px-5 !pb-0 !mb-0"
                style={{ position: 'fixed', top: 56, width: '100%', zIndex: 20 }}
            >
                <EmployeeNav />
            </div>

            <div
                style={{
                    paddingTop: 70,
                    paddingBottom: 100,
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                <div className="mb-3 flex justify-between">
                    <p className="text-default font-extrabold text-xl">
                        <FileTextOutlined className='mr-2' />
                        {content['employeeInfo']}
                    </p>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>

                <Card
                    title={<p className="text-default text-sm font-bold">{content['seniorityPayment']}</p>}
                    className="shadow custom-card"
                >
                    <Timeline mode="left">
                        {sortedBonuses.length > 0 ? (
                            sortedBonuses.map((bonus) => {
                                const payDate = bonus.bonusId?.payDate
                                    ? formatYear(bonus.bonusId.payDate)
                                    : 'No Pay Date';

                                return (
                                    <Timeline.Item
                                        key={bonus._id}
                                        dot={<ClockCircleOutlined style={{ fontSize: 20, color: '#002060' }} />}
                                    >
                                        <div style={{ fontWeight: 'bold', marginBottom: 30, paddingTop: 2 }}>{payDate}</div>

                                        {/* Nested timeline for 6 Months and 12 Months status */}
                                        <Timeline mode="left" style={{ marginLeft: -25 }} className="nested-timeline">
                                            <Timeline.Item
                                                key={`${bonus._id}-six`}
                                                dot={
                                                    bonus.isSix ? (
                                                        <CheckCircleOutlined style={{ color: 'green', fontSize: 16 }} />
                                                    ) : (
                                                        <CloseCircleOutlined style={{ color: 'gray', fontSize: 16 }} />
                                                    )
                                                }
                                            >
                                                6 Months: {bonus.isSix ? `($ ${bonus.isSixTotal})` : ''}
                                            </Timeline.Item>

                                            <Timeline.Item
                                                key={`${bonus._id}-twelve`}
                                                dot={
                                                    bonus.isTwelve ? (
                                                        <CheckCircleOutlined style={{ color: 'green', fontSize: 16 }} />
                                                    ) : (
                                                        <CloseCircleOutlined style={{ color: 'gray', fontSize: 16 }} />
                                                    )
                                                }
                                            >
                                                12 Months: {bonus.isTwelve ? `($ ${bonus.isTwelveTotal})` : ''}
                                            </Timeline.Item>
                                        </Timeline>
                                    </Timeline.Item>
                                );
                            })
                        ) : (
                            <Timeline.Item color="red">
                                <i>No bonus records</i>
                            </Timeline.Item>
                        )}
                    </Timeline>
                </Card>
            </div>
        </>
    );
};

export default EmployeeTimeLinePage;
