import React, { useState, useEffect } from 'react';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Table, Tag, Button, Popconfirm, message, Tooltip, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../../utils/CsStyle';
import { EyeOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { deleteApplicantApi, getApplicantsApi } from '../../../services/applicant';
import { FaUser } from 'react-icons/fa';
import uploadUrl from '../../../services/uploadApi';
import { ConfirmDeleteButton } from '../../../components/button/ConfirmDeleteButton ';

const ApplicantPage = () => {
  const { isLoading, content } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = newSelectedRowKeys => {
      // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
  }

  const breadcrumbItems = [
    { breadcrumbName: content['home'], path: '/' },
    { breadcrumbName: content['applicants'] }
  ];

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getApplicantsApi();
      setApplicants(data);
    } catch (error) {
      message.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/applicants/create');
  };

  const handleUpdate = (id) => {
      navigate(`/applicants/edit/${id}`);
  };

  const handleDelete = async (id) => {
      try {
        await deleteApplicantApi(id); // ✅ Call the delete API
        const updatedApplicants = applicants.filter(applicant => applicant._id !== id); // ✅ Update local list
        setApplicants(updatedApplicants);
        message.success('Applicant deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        message.error('Failed to delete applicant');
      }
  };

  const filteredApplicants = applicants.filter((item) =>
    item.full_name_en?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.full_name_kh?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      render: (text) => (
        text
          ? <img
              src={`${uploadUrl}/uploads/applicants/${encodeURIComponent(text)}`}
              alt="photo"
              width={60}
              height={60}
              style={{ borderRadius: '5px', objectFit: 'cover' }}
            />
          : '-'
      )
    },
    {
      title: 'Full Name (KH)',
      dataIndex: 'full_name_kh',
    },
    {
      title: 'Full Name (EN)',
      dataIndex: 'full_name_en',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" style={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title={content['edit']}>
              <button
                  className={Styles.btnEdit}
                  shape="circle"
                  onClick={() => handleUpdate(record._id)}
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
      )
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Review': return 'blue';
      case 'Shortlist': return 'cyan';
      case 'Interview': return 'gold';
      case 'Fail': return 'red';
      case 'Reserve': return 'orange';
      case 'Hired': return 'green';
      default: return 'default';
    }
  };

  if (isLoading) return <FullScreenLoader />;

  return (
    <div>
      <div className="flex justify-between">
          <h1 className='text-xl font-extrabold text-[#17a2b8]'>
            ព័ត៌មាន{content['applicants']}
          </h1>
          <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      <Content className="border border-gray-200 bg-white p-5 rounded-md mt-4">
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <h5 className='text-lg font-semibold'>Applicants</h5>
          <div className='flex gap-3 mt-2 sm:mt-0'>
            <Input
              placeholder={content['searchAction']}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleCreate} className={Styles.btnCreate}>
              <PlusOutlined /> {`${content['create']} ${content['jobPosting']}`}
            </button>
          </div>
        </div>

        <Table
          className='custom-pagination custom-checkbox-table'
          scroll={{ x: 'max-content' }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredApplicants}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} ${content['of']} ${total} ${content['items']}`,
            onChange: (page, pageSize) => {
                setPagination({
                    ...pagination,
                    current: page,
                    pageSize: pageSize,
                });
            }
          }}
        />
      </Content>
    </div>
  );
};

export default ApplicantPage;
