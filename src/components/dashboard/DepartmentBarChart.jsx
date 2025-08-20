import React from 'react';
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

const DepartmentBarChart = () => {
  const datasets = [
    { label: 'HR', data: [18], backgroundColor: '#002060', borderRadius: 3 },
    { label: 'IT', data: [29], backgroundColor: '#10B981', borderRadius: 3 },
    { label: 'Finance', data: [12], backgroundColor: '#F59E0B', borderRadius: 3 },
    { label: 'Marketing', data: [41], backgroundColor: '#EF4444', borderRadius: 3 },
  ];

  // Calculate total employees
  const totalEmployees = datasets.reduce((sum, d) => sum + d.data[0], 0);

  const data = {
    labels: ['Departments'],
    datasets,
  };

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
      <Bar data={data} options={options} />
    </div>
  );
};

export default DepartmentBarChart;
