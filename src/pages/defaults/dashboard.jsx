import React, { useEffect } from 'react';
import DepartmentBarChart from '../../components/dashboard/DepartmentBarChart';
import GenderPieChart from '../../components/dashboard/GenderPieChart';
import MetricCard from '../../components/dashboard/MetricCard';
import { useAuth } from '../../contexts/AuthContext';
import FullScreenLoader from '../../components/loading/FullScreenLoader';
import CustomBreadcrumb from '../../components/breadcrumb/CustomBreadcrumb';
import RecentAppraisalComp from '../../components/dashboard/RecentAppraisalComp';
import RecentRecruitmentComp from '../../components/dashboard/RecentRecruitmentComp';

const Dashboard = () => {
  const { isLoading, content } = useAuth();
  useEffect(() => {
    document.title = `${content['dashboard']} | USEA`
  }, [content]);

  if (isLoading) return <FullScreenLoader />;
  return (
    <div className="p-0.5 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <h1 className='text-xl font-extrabold text-[#002060]'>{content['home']}</h1>
        <CustomBreadcrumb items={[{ breadcrumbName: content['home'], path: '/' }]} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Employees" count={145} />
        <MetricCard title="Departments" count={12} />
        <MetricCard title="Positions" count={25} />
        <MetricCard title="Applicants" count={320} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <DepartmentBarChart />
          <div className='py-3' />
          <GenderPieChart />
        </div>
        <div className="col-span-5">
          <RecentAppraisalComp />
          <div className='py-3' />
          <RecentRecruitmentComp />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;