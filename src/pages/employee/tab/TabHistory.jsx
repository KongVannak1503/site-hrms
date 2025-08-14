import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getHistoryApi } from '../../../services/employeeApi';
import { Styles } from '../../../utils/CsStyle';
import { useAuth } from '../../../contexts/AuthContext';

const TabHistory = ({ id }) => {
    const { content } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getHistoryApi(id);
                const employment = response.employment_history || [];

                const formatted = employment.map(item => ({
                    ...item,
                    start_date: item.start_date ? moment(item.start_date).format('YYYY-MM-DD') : '',
                    end_date: item.end_date ? moment(item.end_date).format('YYYY-MM-DD') : '',
                }));

                setHistory(formatted);
            } catch (error) {
                console.error('Failed to fetch employee history:', error);
                setHistory([]);
            }
        };

        if (id) fetchInitialData();
    }, [id, content]);

    return (
        <div className="flex flex-col">
            <Card
                title={<p className="text-default text-sm font-bold">{content['employmentHistory']}</p>}
                className="overflow-x-auto"
            >
                <table className="table-auto w-full">
                    <thead className={Styles.tHead}>
                        <tr className="pt-3 border-b">
                            <th className={`text-nowrap ${Styles.tHeadL}`}>{content['position']}</th>
                            <th className="px-3 py-2 text-center text-nowrap">{content['company']}</th>
                            <th className="px-3 py-2 text-center text-nowrap">{content['nameOfSupervisor']}</th>
                            <th className="px-3 py-2 text-center">{content['phone']}</th>
                            <th className="px-3 py-2 text-center">{content['address']}</th>
                            <th className="px-3 py-2 text-center text-nowrap">{content['fromDate']}</th>
                            <th className={`px-3 py-2 text-center text-nowrap ${Styles.tHeadR}`}>{content['toDate']}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index} className="hover:bg-[#f0fbfd] transition">
                                <td className="px-3 py-2 text-sm">{item.position}</td>
                                <td className="px-3 py-2 text-sm">{item.company}</td>
                                <td className="px-3 py-2 text-sm">{item.supervisor_name}</td>
                                <td className="px-3 py-2 text-sm">{item.phone}</td>
                                <td className="px-3 py-2 text-sm">{item.address}</td>
                                <td className="px-3 py-2 text-sm">{item.start_date}</td>
                                <td className="px-3 py-2 text-sm">{item.end_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default TabHistory;
