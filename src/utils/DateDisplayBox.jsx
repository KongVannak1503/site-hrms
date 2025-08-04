import React from 'react';
import dayjs from 'dayjs';

const DateDisplayBox = ({ date }) => {
  const d = dayjs(date);

  return (
    <div className="w-[70px] rounded-lg overflow-hidden shadow text-center text-gray-800">
      <div className="bg-[#f55c47] text-white text-[9px] font-bold py-0.5">
        {d.format('dddd').toUpperCase()}
      </div>
      <div className="bg-white py-1">
        <div className="text-sm">{d.format('MMMM')}</div>
        <div className="text-2xl font-bold leading-none">{d.format('DD')}</div>
      </div>
      <div className="bg-[#f55c47] text-white text-[11px] py-0.5">{d.format('YYYY')}</div>
    </div>
  );
};

export default DateDisplayBox;
