import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = () => {
  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [62, 45],
        backgroundColor: ['#6366F1', '#F472B6'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ allows custom height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 16,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow" style={{ height: 500 }}>
      <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
      <div className="w-full h-[400px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default GenderPieChart;