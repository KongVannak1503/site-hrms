import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import { Card, Col, Row, Statistic, Table, Tag, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  FileSearchOutlined,
  SolutionOutlined,
  CrownOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import FullScreenLoader from '../../components/loading/FullScreenLoader';

const Dashboard = () => {
    const { isLoading, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const res = await api.get('/users/users');
                setLoading(false); // Permission okay, show dashboard
            } catch (err) {
                const status = err.response?.status;
                if (status === 401) {
                    navigate('/login', { replace: true });
                } else if (status === 403) {
                    navigate('/unauthorized', { replace: true });
                } else {
                    console.error('Unexpected error:', err);
                }
            }
        };

        fetchUser();
    }, [token, navigate]);


    if (isLoading) {
        return <FullScreenLoader />;
    }

    const recentApplicants = [
        { key: '1', name: 'John Doe', position: 'QA Tester', status: 'Pending' },
        { key: '2', name: 'Jane Smith', position: 'Software Engineer', status: 'Interviewed' },
    ];

    const appraisalSchedule = [
        { key: '1', employee: 'Sok Dara', type: 'Annual', status: 'Scheduled' },
        { key: '2', employee: 'Chan Vuthy', type: 'Award', status: 'Pending' },
    ];

    const applicantColumns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Position', dataIndex: 'position' },
        { title: 'Status', dataIndex: 'status', render: (status) => <Tag>{status}</Tag> },
    ];

    const appraisalColumns = [
        { title: 'Employee', dataIndex: 'employee' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Status', dataIndex: 'status', render: (status) => <Tag color="blue">{status}</Tag> },
    ];


    return (
        <Content style={{ padding: 24, borderRadius: 8, background: '#fff', marginTop: 10 }}>
            <h2 className="text-lg font-semibold mb-5">HRMS Dashboard Overview</h2>

            {/* Top KPIs */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic title="Total Applicants" value={128} prefix={<FileSearchOutlined />} />
                </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic title="Employees" value={53} prefix={<TeamOutlined />} />
                </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic title="Pending Appraisals" value={8} prefix={<TrophyOutlined />} />
                </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic title="Users" value={12} prefix={<UserOutlined />} />
                </Card>
                </Col>
            </Row>

            {/* Recruitment and Appraisal Panels */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={12}>
                <Card title="Recent Applicants">
                    <Table
                    columns={applicantColumns}
                    dataSource={recentApplicants}
                    pagination={false}
                    size="small"
                    />
                </Card>
                </Col>
                <Col xs={24} md={12}>
                <Card title="Upcoming Appraisals">
                    <Table
                    columns={appraisalColumns}
                    dataSource={appraisalSchedule}
                    pagination={false}
                    size="small"
                    />
                </Card>
                </Col>
            </Row>

            {/* Quick Shortcuts */}
            <Card title="Quick Actions / Modules">
                <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                    <Button icon={<FileSearchOutlined />} block>Recruitment</Button>
                </Col>
                <Col xs={12} sm={6}>
                    <Button icon={<SolutionOutlined />} block>Employment</Button>
                </Col>
                <Col xs={12} sm={6}>
                    <Button icon={<CrownOutlined />} block>Appraisal & Award</Button>
                </Col>
                <Col xs={12} sm={6}>
                    <Button icon={<SettingOutlined />} block>User Management</Button>
                </Col>
                </Row>
            </Card>
        </Content>
    );
};

export default Dashboard;
