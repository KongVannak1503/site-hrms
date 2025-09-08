import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TypeTag from '../style/TypeTag';
import { formatDate } from '../../utils/utils';
import { Avatar, message } from 'antd';
import { STATUS_OPTIONS } from '../../data/Type';
import { useState } from 'react';
import { useEffect } from 'react';
import { getFiveApplicantsApi } from '../../services/applicantApi';
import uploadUrl from '../../services/uploadApi';

// Example dummy data
const getStatusInfo = (value) => STATUS_OPTIONS.find(status => status.value === value);

const dummyAppraisals = [
    { id: 1, name: 'John Doe', job: 'Frontend', date: '2025-08-17', status: 'applied', complete: true, image: "https://i.pravatar.cc/40" },
    { id: 2, name: 'Jane Smith', job: 'Backend', date: '2025-08-16', status: 'hired', complete: false, image: "https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg" },
    { id: 3, name: 'Alice Johnson', job: 'Design', date: '2025-08-15', status: 'rejected', complete: true, image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Pierre-Person.jpg" },
];

const RecentRecruitmentComp = () => {
    const { content, language } = useAuth();
    const [recruitment, setRecruitment] = useState([]);
    // getFiveApplicantsApi

    useEffect(() => {
        document.title = `${content['applicants']} | USEA`
        fetchApplicants();
    }, [content]);

    const fetchApplicants = async () => {
        try {
            const data = await getFiveApplicantsApi();
            setRecruitment(data);
        } catch {
            message.error('Failed to load applicants');
        }
    };

    return (
        <div className="bg-white p-6 rounded-[5px] shadow">
            <p className="text-default text-sm font-bold pb-5">
                {content['recruiter'] || 'Recruitment'}
            </p>

            <div className="overflow-auto max-h-[310px]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-nowrap text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                អ្នកដាក់ពាក្យ
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ការងារ
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ថ្ងៃដាក់ពាក្យ
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ស្ថានភាព
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recruitment.length > 0 ? (
                            recruitment.map((item) => {
                                const status = getStatusInfo(item.status);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                            <Avatar size={30} src={item?.applicant_id.photo ? `${uploadUrl}/uploads/applicants/${item?.applicant_id.photo}` : undefined} />
                                            <span className="ml-2">{language == 'khmer' ? item.full_name_kh : item.full_name_en}</span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {item?.job_id.job_title}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(item.applied_date)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            {status ? (
                                                <span
                                                    className="px-2 py-1 rounded text-white text-xs font-semibold"
                                                    style={{ color: status.color }}
                                                >
                                                    {status.label}
                                                </span>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-4 py-2 text-center text-sm text-gray-400"
                                >
                                    No applicants found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRecruitmentComp;
