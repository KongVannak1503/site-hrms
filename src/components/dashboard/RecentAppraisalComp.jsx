import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TypeTag from '../style/TypeTag';
import { formatDate } from '../../utils/utils';
import { Avatar } from 'antd';

// Example dummy data
const dummyAppraisals = [
    { id: 1, name: 'John Doe', date: '2025-08-17', complete: true, image: "https://i.pravatar.cc/40" },
    { id: 2, name: 'Jane Smith', date: '2025-08-16', complete: false, image: "https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg" },
    { id: 3, name: 'Alice Johnson', date: '2025-08-15', complete: true, image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Pierre-Person.jpg" },
];

const RecentAppraisalComp = () => {
    const { content } = useAuth();

    return (
        <div className="bg-white p-6 rounded-[5px] shadow">
            <p className="text-default text-sm font-bold pb-5">
                {content['appraisal'] || 'Appraisal'}
            </p>

            <div className="overflow-auto max-h-[310px]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                បុគ្គលិក
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ថ្ងៃវាយតម្លៃការងារ
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ស្ថានភាព
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dummyAppraisals.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                    <Avatar size={30} src={item.image} />
                                    <span className="ml-2">
                                        {item.name}
                                    </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                    {formatDate(item.date)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    <TypeTag value={item.date} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentAppraisalComp;
