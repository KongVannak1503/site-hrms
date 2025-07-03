import React, { useState } from 'react'
import FullScreenLoader from '../../../components/loading/FullScreenLoader';
import { useAuth } from '../../../contexts/AuthContext';
import { Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomBreadcrumb from '../../../components/breadcrumb/CustomBreadcrumb';
import { Content } from 'antd/es/layout/layout';
import { Styles } from '../../../utils/CsStyle';
import { EyeOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';

const ApplicationPage = () => {
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
  
  
  const breadcrumbItems = [
        { breadcrumbName: content['home'], path: '/' },
        { breadcrumbName: "Applicantions" }
  ];

  const handleCreate = () => {
    navigate('/job-postings/create');
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} />

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
                        <h5 className='text-lg font-semibold'>Applicants</h5>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <Input
                                // size="large"
                                placeholder={content['searchAction']}
                                // onChange={(e) => handleSearch(e.target.value)}
                                allowClear
                            />
                        </div>
                        <button onClick={handleCreate} className={`${Styles.btnCreate}`}> <PlusOutlined /> {`${content['create']} ${content['jobPosting']}`}</button>
                    </div>
                </div>
      </Content>
    </div>
  )
}

export default ApplicationPage