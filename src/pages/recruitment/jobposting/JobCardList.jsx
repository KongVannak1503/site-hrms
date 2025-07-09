import React, { useState } from 'react';
import { Card, Tag, Avatar, Tooltip, Dropdown, Menu, Pagination } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import uploadUrl from '../../../services/uploadApi';

dayjs.extend(relativeTime);

const JobCardList = ({ jobs, onView, onEdit, onDelete, pageSize = 6, onCardClick }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const getStatus = (job) => {
        const now = dayjs();
        const open = job.open_date ? dayjs(job.open_date) : null;
        const close = job.close_date ? dayjs(job.close_date) : null;

        if (!open || !close) return 'Unknown';
        if (now.isBefore(open)) return 'Draft';
        if (now.isAfter(close)) return 'Closed';
        return 'Open';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'green';
            case 'Closed': return 'red';
            case 'Draft': return 'orange';
            default: return 'default';
        }
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

    return (
        <div>
            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {paginatedJobs.map((job) => {
                    const status = getStatus(job);

                    const menu = (
                        <Menu>
                            <Menu.Item key="view" onClick={() => onView?.(job)}>View</Menu.Item>
                            <Menu.Item key="edit" onClick={() => onEdit?.(job)}>Edit</Menu.Item>
                            <Menu.Item key="delete" onClick={() => onDelete?.(job)} danger>Delete</Menu.Item>
                        </Menu>
                    );

                    return (
                        <Card 
                            key={job._id} 
                            className="shadow relative"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-base font-bold">{job.job_title}</h3>
                                <div className="flex items-center gap-2">
                                    <Tag color={getStatusColor(status)}>{status}</Tag>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <EllipsisOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
                                    </Dropdown>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-2">
                                {job.department?.title || '-'} / {job.position?.title || '-'}
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                                <Avatar.Group size="small" maxCount={3}>
                                    {(job.candidates || []).slice(0, 3).map((c, index) => {
                                        const avatarUrl = c.avatar
                                        ? `${uploadUrl}/uploads/applicants/${c.avatar}`
                                        : null;

                                        return (
                                        <Tooltip key={index} title={c.name || 'Candidate'}>
                                            {avatarUrl ? (
                                            <Avatar size={30} src={avatarUrl} />
                                            ) : (
                                            <Avatar size={30}>{c.name?.charAt(0) || '?'}</Avatar>
                                            )}
                                        </Tooltip>
                                        );
                                    })}
                                </Avatar.Group>
                                <span 
                                    className="text-sm text-gray-600 cursor-pointer" 
                                    onClick={() => onCardClick?.(job)}
                                >
                                    {job.candidates_count ?? 0} Candidates Applied
                                </span>
                            </div>

                            <div className="text-xs text-gray-500 mt-2">
                                <div>Open: {dayjs(job.open_date).format('YYYY-MM-DD')}</div>
                                <div>Close: {dayjs(job.close_date).format('YYYY-MM-DD')}</div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {jobs.length > pageSize && (
                <div className="flex justify-end">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={jobs.length}
                        showSizeChanger={false}
                        onChange={page => setCurrentPage(page)}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                </div>
            )}
        </div>
    );
};

export default JobCardList;
