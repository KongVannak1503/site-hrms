import React, { useEffect } from 'react';
import DepartmentBarChart from '../../components/dashboard/DepartmentBarChart';
import GenderPieChart from '../../components/dashboard/GenderPieChart';
import RecentHiresTable from '../../components/dashboard/RecentHiresTable';
import MetricCard from '../../components/dashboard/MetricCard';
import { useAuth } from '../../contexts/AuthContext';
import FullScreenLoader from '../../components/loading/FullScreenLoader';

const Dashboard = () => {
    const {isLoading, content} = useAuth();
    useEffect(() => {
        document.title = `${content['dashboard']} | USEA`
    }, [content]);

    if (isLoading) return <FullScreenLoader />;
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Employees" count={145} />
        <MetricCard title="Departments" count={12} />
        <MetricCard title="Positions" count={25} />
        <MetricCard title="Applicants" count={320} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentBarChart />
        <GenderPieChart />
      </div>

      {/* Recent Hires */}
      <RecentHiresTable />
    </div>
  );
};

export default Dashboard;
