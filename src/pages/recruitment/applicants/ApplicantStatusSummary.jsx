import { Card } from 'antd';
import {
  UserOutlined,
  FileSearchOutlined,
  InboxOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  SmileOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const statusConfig = [
    { key: 'Review', label: 'Applied', icon: <UserOutlined />, color: '#1890ff' },
    { key: 'Shortlist', label: 'Shortlisted', icon: <FileSearchOutlined />, color: '#722ed1' },
    { key: 'Test', label: 'Test', icon: <InboxOutlined />, color: '#faad14' },
    { key: 'Interview', label: 'Interview', icon: <CommentOutlined />, color: '#13c2c2' },
    { key: 'Hired', label: 'Hired', icon: <CheckCircleOutlined />, color: '#52c41a' },
    { key: 'Reserve', label: 'Reserve', icon: <SmileOutlined />, color: '#2f54eb' },
    { key: 'Fail', label: 'Rejected', icon: <CloseCircleOutlined />, color: '#f5222d' },
];

const ApplicantStatusSummary = ({ applicants = [] }) => {
    const statusCounts = statusConfig.reduce((acc, s) => {
        acc[s.key] = applicants.filter(app => app.status === s.key).length;
        return acc;
    }, {});

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {statusConfig.map(({ key, label, icon, color }) => (
        <Card
          key={key}
          className="shadow border border-gray-200"
          style={{ borderLeft: `5px solid ${color}` }}
        >
          <div className="flex items-center justify-between">
            <div>
                <h3 className="text-md font-semibold text-gray-700">{label}</h3>
                <p className="text-2xl font-bold text-gray-900">{statusCounts[key] || 0}</p>
            </div>
            <div className="text-3xl" style={{ color }}>{icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ApplicantStatusSummary;
