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
  const data = {
    labels: ['HR', 'IT', 'Finance', 'Marketing'],
    datasets: [
      {
        label: 'Employees',
        data: [20, 40, 15, 25],
        backgroundColor: '#3B82F6',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">Employees by Department</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DepartmentBarChart;
