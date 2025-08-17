import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = () => {
  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [62, 45],
        backgroundColor: ['blue', '#F59E0B'],
        borderWidth: 1,
      },
    ],
  };

  const totalEmployees = data.datasets[0].data.reduce((a, b) => a + b, 0);

  // Custom plugin to draw text in the center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#17a2b8'; // dark text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`បុគ្គលិកសរុប: ${totalEmployees}`, centerX, centerY);
      ctx.restore();
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 16,
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-[5px] shadow">
      <p className="text-default text-sm font-bold pb-2">
        ភេទ
      </p>
      <div className="w-full h-[330px]">
        <Pie data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
};

export default GenderPieChart;
