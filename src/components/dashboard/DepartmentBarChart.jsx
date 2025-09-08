import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DepartmentBarChart = ({ departments }) => {
  const colors = [
    '#002060', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6',
    '#F97316', '#14B8A6', '#E11D48', '#6366F1', '#F43F5E', '#0EA5E9',
    '#A855F7', '#FACC15', '#65A30D', '#F87171', '#22D3EE', '#C026D3',
    '#EAB308', '#4B5563', '#9333EA', '#F472B6', '#2563EB', '#84CC16',
    '#FB923C', '#06B6D4', '#DB2777', '#7C3AED', '#FBBF24', '#16A34A',
    '#EF4444', '#0F172A', '#818CF8', '#F0ABFC', '#2DD4BF', '#FDE68A',
    '#F43F5E', '#14B8A6', '#A21CAF', '#FCD34D', '#4ADE80', '#D946EF',
    '#60A5FA', '#F87171', '#22C55E', '#FBBF24', '#3B82F6', '#E879F9',
    '#EC4899', '#0EA5E9'
  ];

  const [chartData, setChartData] = useState({ datasets: [], labels: ['Departments'] });
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    const depts = departments || []; // ensure it's always an array
    const datasets = depts.map((dept, index) => ({
      label: dept.departmentName,
      data: [dept.count ?? 0],
      backgroundColor: colors[index % colors.length],
      borderRadius: 3,
    }));
    const total = depts.reduce((sum, dept) => sum + (dept.count ?? 0), 0);

    setChartData({ datasets, labels: ['Departments'] });
    setTotalEmployees(total);
  }, [departments]);


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { usePointStyle: false } },
      tooltip: { enabled: true },
    },
    scales: {
      x: { stacked: false, ticks: { display: false }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 5 } },
    },
    datasets: { bar: { maxBarThickness: 30 } },
  };

  return (
    <div className="bg-white px-6 pt-10 pb-20 rounded-[5px] shadow w-full h-[380px]">
      <p className="text-default text-sm font-bold pb-2">
        បុគ្គលិកតាមនាយកដ្ឋាន
      </p>
      <p className="text-default text-sm font-bold pb-2">
        បុគ្គលិកសរុប: {totalEmployees}
      </p>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DepartmentBarChart;
