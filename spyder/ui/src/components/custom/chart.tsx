import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

interface ChartProps {
  data: number[];
  labels: string[];
}

const Chart: React.FC<ChartProps> = ({ data, labels }) => {
  const maxDataPoints = 10;
  const threshold = 75; // Example threshold value
  const limitedData = data.slice(-maxDataPoints);
  const limitedLabels = labels.slice(-maxDataPoints);

  const chartData = {
    labels: limitedLabels,
    datasets: [
      {
        label: 'Battery Temperature',
        data: limitedData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointBackgroundColor: limitedData.map(value => value > threshold ? 'red' : 'rgba(75, 192, 192, 1)'),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Live Battery Temperature',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const timestamp = limitedLabels[context.dataIndex];
            return `${label}: ${value}°C at ${timestamp}`;
          }
        }
      },
      annotation: {
        annotations: {
          thresholdLine: {
            type: 'line' as const,
            yMin: threshold,
            yMax: threshold,
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Threshold',
              enabled: true,
              position: 'end' as const,
            },
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Chart;