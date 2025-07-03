import React from 'react';
import { Card, Upload, Form, Input, Select, DatePicker, Button, Tabs } from 'antd';
import { FaRegImages } from 'react-icons/fa';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { nationalityOption } from '../../data/Nationality';


const EmployeePersonalTab = ({ content, fileList, handleChange, previewUrl, genderOptions, cities, districts, communes, villages }) => {

    return (
        <div>
            <Card title={<p className='text-default text-sm font-bold'>{content['informationData']}</p>} className="shadow custom-card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Upload image */}
                    <div className="col-span-1 flex justify-center">
                        {/* <label className="text-sm font-semibold text-gray-700">{content['logo']}</label> */}
                        <div>
                            <Upload
                                listType="picture"
                                maxCount={1}
                                accept="image/*"
                                onChange={handleChange}
                                beforeUpload={() => false}
                                fileList={fileList}
                                showUploadList={false}
                            >
                                <div className="border mt-2 relative border-dashed bg-gray-50 hover:bg-gray-100  rounded-lg cursor-pointer hover:border-blue-500 w-[180px] h-[200px] flex items-center justify-center overflow-hidden">
                                    {previewUrl ? (
                                        <>
                                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 whitespace-nowrap">
                                                {content['uploadImage']}
                                            </p>
                                            <img
                                                src={previewUrl}
                                                alt="Uploaded"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <div className=''>
                                            <p className="absolute bottom-2 right-1 bg-white border border-gray-400 rounded shadow-sm py-1 px-2 whitespace-nowrap">
                                                {content['uploadImage']}
                                            </p>
                                            <FaRegImages style={{ width: '100px', height: '100px', color: '#ccc' }} />
                                        </div>
                                    )}
                                </div>
                            </Upload>
                        </div>
                    </div >

                    {/* Basic info */}
                    < div className="md:col-span-3" >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Form.Item name="employee_id" label={content['employeeID']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['employeeID']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="first_name_kh" label={content['firstNameKh']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['employeeID']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="last_name_kh" label={content['lastNameKh']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['lastName']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="last_name_en" label={content['lastNameEn']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['lastName']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="first_name_en" label={content['firstNameEn']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['firstName']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="gender" label={content['gender']} rules={[{ required: true, message: `${content['please']}${content['select']}${content['gender']}` }]}>
                                <Select>
                                    {genderOptions.map(option => (
                                        <Select.Option key={option.name_kh} value={option.name_kh}>
                                            {option.name_kh}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div >

                </div >

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item name="date_of_birth" label={content['dateOfBirth']}><DatePicker className="w-full" /></Form.Item>
                    <Form.Item name="nationality" label={content['nationality']}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().includes(input.toLowerCase())
                            }>
                            {nationalityOption.map(option => (
                                <Select.Option key={option.name_en} value={option.name_kh}>
                                    {option.name_kh}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="id_card_no" label={content['idCardNo']}><Input /></Form.Item>
                    <Form.Item name="passport_no" label={content['passportNo']}><Input /></Form.Item>

                </div>
                <Tabs
                    defaultActiveKey="present"
                    className='custom-tabs'
                    items={[
                        {
                            label: 'Present Address',
                            key: 'present',
                            children: (
                                <>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <Form.Item
                                            name={['present_address', 'email']}
                                            label={content['email']}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={['present_address', 'phone']}
                                            label={content['phone']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        name={['present_address', 'description']}
                                        label={content['description']}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </>
                            ),
                        },
                        {
                            label: 'Permanent Address',
                            key: 'permanent',
                            children: (
                                <>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <Form.Item
                                            name={['permanent_address', 'email']}
                                            label={content['email']}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={['permanent_address', 'phone']}
                                            label={content['phone']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <Form.Item
                                        name={['permanent_address', 'description']}
                                        label={content['description']}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </>
                            ),
                        },
                    ]}
                />
                <p className='text-default text-sm font-bold mb-4'>ទីកន្លែងកំណើត</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item name="city" label={content['province']}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {cities.map((city) => (
                                <Select.Option key={city._id || city.id} value={city._id}>
                                    {city.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="district" label={content['district']}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {districts.map((district) => (
                                <Select.Option key={district._id} value={district._id}>
                                    {district.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="commune" label={content['commune']}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {communes.map((commune) => (
                                <Select.Option key={commune._id} value={commune._id}>
                                    {commune.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="village" label={content['village']}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {villages.map((village) => (
                                <Select.Option key={village._id} value={village._id}>
                                    {village.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>



            </Card >
            <hr className="border-0 py-3" />
            <Card title={<p className='text-default text-sm font-bold'>{content['familyMemberInformation']}</p>} className="shadow">
                <Form.List name="family_members">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="grid items-center grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label={content['name']}
                                        rules={[{ required: true, message: `${content['please']}${content['enter']}${content['name']}` }]}


                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'relationship']}
                                        label={content['relationship']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'position']}
                                        label={content['position']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'phone']}
                                        label={content['phone']}
                                    >
                                        <div className="flex">
                                            <Input />

                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                aria-label="Remove family member"
                                            />
                                        </div>
                                    </Form.Item>

                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    {content["addFamilyMember"]}
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>

            <hr className="border-0 py-3" />
            <Card title={<p className='text-default text-sm font-bold'>{content['inCaseOfEmergencyContact']}</p>} className="shadow">
                <Form.List name="emergency_contact">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="grid items-center grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label={content['name']}
                                        rules={[{ required: true, message: `${content['please']}${content['enter']}${content['name']}` }]}


                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'relationship']}
                                        label={content['relationship']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'position']}
                                        label={content['position']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'phone']}
                                        label={content['phone']}
                                    >
                                        <div className="flex">
                                            <Input />

                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                aria-label="Remove Emergency Contact"
                                            />
                                        </div>
                                    </Form.Item>

                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    {content["addEmergencyContact"]}
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>

            <hr className="border-0 py-3" />
            {/* <Card title="Relationship With Staff" className="shadow">
                <p className='mb-5'> Do you have any relationship with staff?  if the answer is "yes", give the following information:</p>
                <Form.List name="staff_relationships">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="grid items-center grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label={content['name']}

                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name={[name, 'date_of_birth']}
                                        label={content['dateOfBirth']}
                                    >
                                        <DatePicker className='w-[100%]' />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'position']}
                                        label={content['position']}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'relationship']}
                                        label={content['relationship']}
                                    >
                                        <div className="flex">
                                            <Input />

                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                aria-label="Remove Emergency Contact"
                                            />
                                        </div>
                                    </Form.Item>

                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Emergency Contact
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card> */}
        </div >
    );
};

export default EmployeePersonalTab;
