import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Button, Card, Divider, Drawer, Form, Input, message, Space, Table, Tag, Tooltip } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { EyeOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Styles } from '../../../utils/CsStyle';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { formatDateTime } from '../../../utils/utils';
import { deleteJobPostingApi, getJobPostingsApi } from '../../../services/jobPosting';
import dayjs from 'dayjs';
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa6";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JobCardList from './JobCardList';


const JobPostingPage = () => {
    const { isLoading, content } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);


    const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: content['jobPosting'] }
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await getJobPostingsApi();
                setUsers(res);
                setFilteredData(res);
                setPagination(prev => ({ ...prev, total: res.length }));
            } catch (error) {
                console.error('Failed to fetch job postings:', error);
                message.error('Failed to load job postings');
            }
        };

        fetchJobs();
    }, []);

    const handleSearch = (value) => {
        const term = value.trim().toLowerCase();

        if (!term) {
            setFilteredData(users);
        } else {
            const filtered = users.filter(job =>
                job.job_title?.toLowerCase().includes(term) ||
                job.position?.title?.toLowerCase().includes(term) ||
                job.department?.title?.toLowerCase().includes(term)
            );
            setFilteredData(filtered);
        }
    };

    const handleCreate = () => {
        navigate('/job-postings/create');
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    }

    const handleUpdateNav = (id) => {
        navigate(`/job-postings/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteJobPostingApi(id); // call the API
            const updatedUsers = users.filter(job => job._id !== id);
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            message.success('Deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete');
        }
    };

    const handleView = (record) => {
        setSelectedJob(record);
        setViewDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setViewDrawerVisible(false);
        setSelectedJob(null);
    };

    const handleCardClick = (job) => {
        navigate(`/job-postings/${job._id}/candidates`);
    };

    const columns = [
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
            render: (position) => <span>{position?.title || '-'}</span>,
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (department) => <span>{department?.title || '-'}</span>,
        },
        {
            title: "Quantity",
            dataIndex: "quantity_available",
            key: "quantity_available",
        },

        {
            title: "Open Date",
            dataIndex: "open_date",
            key: "open_date",
            render: (text) => <span>{formatDateTime(text)}</span>,
        },
        {
            title: "Close Date",
            dataIndex: "close_date",
            key: "close_date",
            render: (text) => <span>{formatDateTime(text)}</span>,
        },
        {
            title: content['numberOfCandidates'] || 'Candidates',
            dataIndex: 'candidates_count',
            key: 'candidates_count',
            align: 'center',
            render: (count) => count ?? 0,
        },
        {
            title: content['status'],
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                const now = dayjs();
                const openDate = record.open_date ? dayjs(record.open_date) : null;
                const closeDate = record.close_date ? dayjs(record.close_date) : null;

                if (!openDate || !closeDate) {
                    return <span style={{ color: 'gray' }}>Unknown</span>;
                }

                if (now.isBefore(openDate)) {
                    return <span style={{ color: 'orange', fontWeight: 'bold' }}>Draft</span>;
                }

                if (now.isAfter(closeDate)) {
                    return <span style={{ color: 'red', fontWeight: 'bold' }}>Close</span>;
                }

                if (now.isAfter(openDate) && now.isBefore(closeDate)) {
                    return <span style={{ color: 'green', fontWeight: 'bold' }}>Open</span>;
                }

                // Fallback (in case dates are equal or something unexpected)
                return <span>Unknown</span>;
            }
        },
        {
            title: (
                <span style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {content['action']}
                </span>
            ),
            key: "action",
            render: (_, record) => (
                <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="View">
                        <button
                            className={Styles.btnView}
                            shape="circle"
                            onClick={() => handleView(record)}
                        >
                            <EyeOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={content['edit']}>
                        <button
                            className={Styles.btnEdit}
                            shape="circle"
                            onClick={() => handleUpdateNav(record._id)}
                        >
                            <FormOutlined />
                        </button>
                    </Tooltip>
                    {ConfirmDeleteButton({
                        onConfirm: () => handleDelete(record._id),
                        tooltip: content['delete'],
                        title: content['confirmDelete'],
                        okText: content['yes'],
                        cancelText: content['no'],
                        description: `${content['areYouSureToDelete']} ${record.name || 'this item'}?`
                    })}
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: changeableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: changeableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

    const getStatusText = (job) => {
        const now = dayjs();
        const open = job.open_date ? dayjs(job.open_date) : null;
        const close = job.close_date ? dayjs(job.close_date) : null;

        if (!open || !close) return 'Unknown';
        if (now.isBefore(open)) return 'Draft';
        if (now.isAfter(close)) return 'Close';
        return 'Open';
    };


    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const handleExportExcel = () => {
        const exportData = (selectedRowKeys.length > 0 ? users.filter(job => selectedRowKeys.includes(job._id)) : users).map(job => ({
            'Job Title': job.job_title,
            'Department': job.department?.title || '',
            'Position': job.position?.title || '',
            'Job Type': job.job_type?.title || '',
            'Quantity': job.quantity_available,
            'Open Date': dayjs(job.open_date).format('YYYY-MM-DD'),
            'Close Date': dayjs(job.close_date).format('YYYY-MM-DD'),
            'Status': getStatusText(job),
            'Responsibilities': stripHtml(job.responsibilities || ''),
            'Requirements': stripHtml(job.requirements || '')
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Postings');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer]), 'job_postings.xlsx');
    };

    const truncate = (text, maxLength = 100) =>
        text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    const handleExportPDF = () => {
        const dataToExport = selectedRowKeys.length > 0
            ? users.filter(job => selectedRowKeys.includes(job._id))
            : users;

        const doc = new jsPDF();
        doc.text('Job Postings', 14, 10);

        const tableData = dataToExport.map((job, index) => [
            index + 1,
            job.job_title,
            job.department?.title || '',
            job.position?.title || '',
            job.job_type?.title || '',
            job.quantity_available,
            dayjs(job.open_date).format('YYYY-MM-DD'),
            dayjs(job.close_date).format('YYYY-MM-DD'),
            getStatusText(job),
            truncate(stripHtml(job.responsibilities || ''), 100),
            truncate(stripHtml(job.requirements || ''), 100),
        ]);

        autoTable(doc, {
            startY: 20,
            head: [['#', 'Title', 'Dept', 'Pos.', 'Type', 'Qty', 'Open', 'Close', 'Status', 'Responsibilities', 'Requirements']],
            body: tableData,
            styles: {
                fontSize: 8,
                cellWidth: 'wrap',
            },
            columnStyles: {
                9: { cellWidth: 60 }, // responsibilities
                10: { cellWidth: 60 } // requirements
            }
        });

        doc.save('job_postings.pdf');
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className='text-xl font-extrabold text-[#17a2b8]'>
                    ព័ត៌មាន{content['jobPosting']}
                </h1>
                <CustomBreadcrumb items={breadcrumbItems} />
            </div>

            <Content
                className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >
                <div className='block sm:flex justify-between items-center mb-4'>
                    <div className='mb-3 sm:mb-1'>
                        <h5 className='text-lg font-semibold'>{content['jobPostings']}</h5>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                // size="large"
                                placeholder={content['searchAction']}
                                onChange={(e) => handleSearch(e.target.value)}
                                allowClear
                            />
                        </div>
                        <Button onClick={handleExportPDF} className="">
                            <FaRegFilePdf />
                        </Button>
                        <Button onClick={handleExportExcel} className="">
                            <FaRegFileExcel />
                        </Button>
                        <button onClick={handleCreate} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['jobPosting']}`}</button>
                    </div>
                </div>

                <JobCardList
                    jobs={filteredData}
                    onView={(job) => handleView(job)}
                    onEdit={(job) => handleUpdateNav(job._id)}
                    onDelete={(job) => handleDelete(job._id)}
                    pageSize={6}
                    onCardClick={handleCardClick}
                />

                <Drawer
                    title={
                        <div className="text-xl font-semibold">
                            {selectedJob?.job_title} - {selectedJob?.department?.title}
                        </div>
                    }
                    placement="right"
                    onClose={handleCloseDrawer}
                    open={viewDrawerVisible}
                    width={700}
                    maskClosable={false}     // Sticky behavior
                    closable={true}
                    keyboard={false}
                >
                    {selectedJob && (
                        <div className="grid grid-cols-1 gap-4">
                        {/* Department & Position */}
                        <div className="grid grid-cols-3 items-start gap-2">
                            <div className="text-[16px] font-semibold">Department:</div>
                            <div className="col-span-2">
                            <Tag color="blue">{selectedJob.department?.title || '-'}</Tag>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-start gap-2">
                            <div className="text-[16px] font-semibold">Position:</div>
                            <div className="col-span-2">
                            <Tag color="green">{selectedJob.position?.title || '-'}</Tag>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-start gap-2">
                            <div className="text-[16px] font-semibold">Job Type:</div>
                            <div className="col-span-2">
                                <div>{selectedJob.job_type?.title || '-'}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-start gap-2">
                            <div className="text-[16px] font-semibold">Quantity Available:</div>
                            <div className="col-span-2">
                                <div>{selectedJob.quantity_available}</div>
                            </div>
                        </div>

                        {/* Responsibilities */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-[16px] font-semibold">Job Description:</div>
                            <div className="col-span-2 prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: selectedJob.responsibilities || '-' }} />
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-[16px] font-semibold">Key Requirements:</div>
                            <div className="col-span-2 prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: selectedJob.requirements || '-' }} />
                            </div>
                        </div>

                        {/* Dates & Quantity */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-[16px] font-semibold">Open Date:</div>
                                    <div>{dayjs(selectedJob.open_date).format('YYYY-MM-DD')}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                <div className="text-[16px] font-semibold">Close Date:</div>
                                    <div>{dayjs(selectedJob.close_date).format('YYYY-MM-DD')}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Drawer>

            </Content>
        </div>
    )
}

export default JobPostingPage