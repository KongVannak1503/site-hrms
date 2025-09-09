import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/solid';
import React from 'react';

const iconMap = {
  'Total Employees': {
    icon: UserGroupIcon,
    bg: 'bg-blue-100',
    color: 'text-blue-500',
  },
  Departments: {
    icon: BuildingOfficeIcon,
    bg: 'bg-green-100',
    color: 'text-green-500',
  },
  Positions: {
    icon: BriefcaseIcon,
    bg: 'bg-purple-100',
    color: 'text-purple-500',
  },
  Applicants: {
    icon: UserPlusIcon,
    bg: 'bg-pink-100',
    color: 'text-pink-500',
  },
};

const MetricCard = ({ title, count, iconDep, bg = "bg-gray-100", color = "text-gray-500" }) => {
  const iconInfo = iconMap[title] || {};

  return (
    <motion.div
      className="bg-white p-5 rounded-[5px] shadow hover:shadow-md transition duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`rounded-[5px] p-2 ${bg} ${color}`}
        >
          {iconDep && React.createElement(iconDep, { className: "h-6 w-6" })}
        </motion.div>

        {/* Main Metric */}
        <div>
          <p className="text-xl font-semibold text-gray-800">{count}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;