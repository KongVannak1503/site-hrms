import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';
import React, { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = ({ genders }) => {
  const { content } = useAuth();

  // If genders is undefined or total is 0, show loading placeholder
  if (!genders || typeof genders.total !== 'number') {
    return (
      <div className="bg-white p-6 rounded-[5px] shadow">
        <p className="text-default text-sm font-bold pb-2">ភេទ</p>
        <div className="w-full h-[330px] flex items-center justify-center">
          <p className="text-gray-500">{content['loading'] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Extract counts with fallback
  const maleCount = genders.male ?? 0;
  const femaleCount = genders.female ?? 0;
  const totalEmployees = genders.total ?? (maleCount + femaleCount);

  // Chart data
  const data = useMemo(() => ({
    labels: [content['male'] || "Male", content['female'] || 'Female'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#002060', '#F59E0B'],
        borderWidth: 1,
      },
    ],
  }), [maleCount, femaleCount, content]);

  // Plugin to display total in the center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      if (!meta?.data?.[0]) return;

      const centerX = meta.data[0].x;
      const centerY = meta.data[0].y;
      const innerRadius = meta.data[0].innerRadius;

      ctx.save();
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#002060';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = `${content['totalEmployee'] || 'បុគ្គលិកសរុប'}: ${totalEmployees}`;
      const maxWidth = innerRadius * 1.6;
      const lineHeight = 20;

      // Word wrap
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

      const totalHeight = lines.length * lineHeight;
      const startY = centerY - totalHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, centerX, startY + index * lineHeight);
      });

      ctx.restore();
    },
  };

  // Chart options
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
      <p className="text-default text-sm font-bold pb-2">ភេទ</p>
      <div className="w-full h-[330px]">
        <Pie
          data={data}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>
    </div>
  );
};

export default GenderPieChart;
