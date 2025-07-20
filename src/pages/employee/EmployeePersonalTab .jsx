import React from 'react';
import { Card, Upload, Form, Input, Select, DatePicker, Button, Tabs } from 'antd';
import { FaRegImages } from 'react-icons/fa';
import { PlusOutlined, MinusCircleOutlined, FormOutlined } from '@ant-design/icons';
import { nationalityOption } from '../../data/Nationality';
import CityUpdatePage from '../settings/employee/city/CityUpdatePage';
import CityCreatePage from '../settings/employee/city/CityCreatePage';
import ModalMdCenter from '../../components/modals/ModalMdCenter';
import { bloodTypeOptions, typeEmpStatusOptions } from '../../data/Type';


const EmployeePersonalTab = ({ position, showCreateDrawer, content, fileList, handleChange, previewUrl, genderOptions, cities, districts, communes, villages, language }) => {

    return (
        <div>
            <Card title={<p className='text-default text-sm font-bold'>{content['1'] + "." + content['informationData']}</p>} className="shadow custom-card">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                            <Form.Item name="email" label={content['email']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['firstName']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label={content['phone']} rules={[{ required: true, message: `${content['please']}${content['enter']}${content['firstName']}` }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="bloodType" label={content['bloodType']} rules={[{ required: true, message: `${content['please']}${content['select']}${content['gender']}` }]}>
                                <Select>
                                    {bloodTypeOptions.map(option => (
                                        <Select.Option key={option.name} value={option.name}>
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item name="joinDate" label={content['joinDate']}><DatePicker className="w-full" /></Form.Item>
                    <Form.Item
                        label={content['department']}
                    >
                        <Input className='text-default' disabled value={position?.positionId?.title} />
                    </Form.Item>
                    <Form.Item
                        label={content['role']}
                    >
                        <Input className='text-default' disabled value={position?.positionId?.title} />
                    </Form.Item>
                    <Form.Item name="status" label={content['status']} rules={[{ required: true, message: `${content['please']}${content['select']}${content['status']}` }]}>
                        <Select>
                            {typeEmpStatusOptions.map(option => (
                                <Select.Option key={option.id} value={option.id}>
                                    {language == 'khmer' ? option.name_kh : option.name_en}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <p className='text-default text-sm font-bold mb-4'>{content['placeOfBirth']}</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item name="city" label={content['province']}>
                        <div className="flex items-center gap-2">
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
                                        <div className="flex justify-between items-center">
                                            <span>{city.name}</span>
                                            <span
                                                className=" hover:text-blue-600 ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showCreateDrawer('update', city._id); // your update modal
                                                }}
                                            >
                                                <FormOutlined />
                                            </span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                            <PlusOutlined
                                className="text-blue-500 cursor-pointer hover:text-blue-600"
                                onClick={() => showCreateDrawer('create', '')}
                            />
                        </div>

                    </Form.Item>
                    <Form.Item name="district" label={content['district']}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="commune" label={content['commune']}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="village" label={content['village']}>
                        <Input />
                    </Form.Item>
                </div>

                <p className='text-default text-sm font-bold mb-4'>{content['presentAddress']}</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Form.Item name="present_city" label={content['province']}>
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
                    <Form.Item name="present_district" label={content['district']}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="present_commune" label={content['commune']}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="present_village" label={content['village']}>
                        <Input />
                    </Form.Item>
                </div>
            </Card >

            <hr className="border-0 py-3" />
            <Card title={<p className='text-default text-sm font-bold'>{content['2'] + "." + content['familyMemberInformation']}</p>} className="shadow">
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
            <Card title={<p className='text-default text-sm font-bold'>{content['3'] + "." + content['inCaseOfEmergencyContact']}</p>} className="shadow">
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

        </div >
    );
};

export default EmployeePersonalTab;
