import React from 'react';

interface PercentageChangeProps {
  data: number[];
}

const PercentageChange: React.FC<PercentageChangeProps> = ({ data }) => {
  if (data.length < 2) {
    return <div>No data available</div>;
  }

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const latestChange = calculateChange(data[data.length - 1], data[data.length - 2]);

  return (
    <div className="percentage-change">
      <div className={latestChange >= 0 ? 'text-green-500' : 'text-red-500'}>
        {latestChange.toFixed(2)}%
      </div>
    </div>
  );
};

export default PercentageChange;