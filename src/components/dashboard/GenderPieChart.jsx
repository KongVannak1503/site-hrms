import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = () => {
  const { content } = useAuth();
  useEffect(() => {
  }, [content]);
  const data = {
    labels: [content['male'] || "Male", content['female'] || 'Female'],
    datasets: [
      {
        data: [62, 38],
        backgroundColor: ['#002060', '#F59E0B'],
        borderWidth: 1,
      },
    ],
  };

  const totalEmployees = data.datasets[0].data.reduce((a, b) => a + b, 0);

  // Custom plugin to draw text in the center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      if (!meta || !meta.data || !meta.data[0]) return;

      // get donut center
      const centerX = meta.data[0].x;
      const centerY = meta.data[0].y;
      const innerRadius = meta.data[0].innerRadius;

      ctx.save();
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#002060';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = `${content['totalEmployee'] || 'បុគ្គលិកសរុប'}: ${totalEmployees}`;
      const maxWidth = innerRadius * 1.6; // keep text inside the donut hole
      const lineHeight = 20;

      // word wrap
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      // vertical center inside donut
      const totalHeight = lines.length * lineHeight;
      const startY = centerY - totalHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, centerX, startY + index * lineHeight);
      });

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
        <Pie key={content['totalEmployee']} data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
};

export default GenderPieChart;
