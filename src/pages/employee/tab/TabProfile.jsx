import { Card, Divider } from 'antd'
import React from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { genderOptions } from '../../../data/Gender';
import { formatDate } from '../../../utils/utils';
import { nationalityOption } from '../../../data/Nationality';

const TabProfile = ({ employee }) => {
    const { content, language } = useAuth();
    const gender = employee?.gender;
    const familyMember = employee?.family_member || [];
    const emergencyContact = employee?.emergency_contact || [];

    const genderObj = genderOptions.find(opt => opt.name_kh === gender);

    const displayGender = language === 'khmer'
        ? genderObj?.name_kh
        : genderObj?.name_en;

    const nationality = employee?.nationality; // example: 'ប្រុស' or 'ស្រី'

    const nationalityObj = nationalityOption.find(opt => opt.name_kh === nationality);

    const displayNationality = language === 'khmer'
        ? nationalityObj?.name_kh
        : nationalityObj?.name_en;
    return (
        <div>
            <Card title={<p className='text-default text-sm font-bold'>{content['1'] + "." + content['informationData']}</p>}>
                <div className="flex gap-10">
                    <div>
                        <div className='grid grid-cols-2 gap-3'>
                            <p className='text-gray-500'>{content['fullName']}</p>
                            <p>{language == 'khmer' ? employee?.name_kh : employee?.name_en}</p>

                            <p className='text-gray-500'>{content['dateOfBirth']}</p>
                            <p>{formatDate(employee.date_of_birth)}</p>

                            <p className='text-gray-500'>{content['nationality']}</p>
                            <p>{displayNationality}</p>

                            <p className='text-gray-500'>{content['email']}</p>
                            <p>{employee?.email}</p>
                        </div>
                    </div>
                    <div>
                        <div className='grid grid-cols-2 gap-3'>
                            <p className='text-gray-500'>{content['gender']}</p>
                            <p>{displayGender || '-'}</p>

                            <p className='text-gray-500'>{content['phone']}</p>
                            <p>{employee?.phone || '-'}</p>
                        </div>
                    </div>
                </div>
            </Card>
            <div className='!border-0 py-3' />
            <Card title={<p className='text-default text-sm font-bold'>{content['placeOfBirth']}</p>}>
                <div className="flex">
                    <div className='grid grid-cols-2 gap-3'>
                        <p className='text-gray-500'>{content['province']}</p>
                        <p>{employee?.city?.name} </p>

                        <p className='text-gray-500'>{content['commune']}</p>
                        <p>{employee?.commune || '-'}</p>
                    </div>
                    <div className='grid grid-cols-2 gap-3 pl-4'>
                        <p className='text-gray-500'>{content['district']}</p>
                        <p>{employee?.district || "-"}</p>

                        <p className='text-gray-500'>{content['village']}</p>
                        <p>{employee?.village || "-"}</p>
                    </div>
                </div>

            </Card>
            <div className='!border-0 py-3' />
            <Card title={<p className='text-default text-sm font-bold'>{content['presentAddress']}</p>}>
                <div className="flex gap-10">
                    <div className='grid grid-cols-2 gap-3'>
                        <p className='text-gray-500'>{content['province']}</p>
                        <p>{employee?.present_city?.name}</p>

                        <p className='text-gray-500'>{content['commune']}</p>
                        <p>{employee?.present_commune || '-'}</p>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <p className='text-gray-500'>{content['district']}</p>
                        <p>{employee?.present_district || "-"}</p>

                        <p className='text-gray-500'>{content['village']}</p>
                        <p>{employee?.present_village || "-"}</p>
                    </div>
                </div>

            </Card>

            <div className='!border-0 py-3' />
            <Card title={<p className='text-default text-sm font-bold'>{content['familyMemberInformation']}</p>}>

                {Array.isArray(familyMember) && familyMember.length > 0 && familyMember.map((member, index) => (

                    <div>
                        <div className="flex gap-10">
                            <div className='grid grid-cols-2 gap-3'>
                                <p className='text-gray-500'>{content['name']}</p>
                                <p>{member?.name}</p>

                                <p className='text-gray-500'>{content['relationship']}</p>
                                <p>{member?.relationship || '-'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <p className='text-gray-500'>{content['position']}</p>
                                <p>{member?.position || "-"}</p>

                                <p className='text-gray-500'>{content['phone']}</p>
                                <p>{member?.phone || "-"}</p>
                            </div>
                        </div>
                        {familyMember.length > 1 && index !== familyMember.length - 1 && (
                            <Divider />
                        )}
                    </div>
                ))}
            </Card>

            <div className='!border-0 py-3' />
            <Card title={<p className='text-default text-sm font-bold'>{content['inCaseOfEmergencyContact']}</p>}>

                {Array.isArray(emergencyContact) && emergencyContact.length > 0 && emergencyContact.map((member, index) => (

                    <div>
                        <div className="flex gap-10">
                            <div className='grid grid-cols-2 gap-3'>
                                <p className='text-gray-500'>{content['name']}</p>
                                <p>{member?.name}</p>

                                <p className='text-gray-500'>{content['relationship']}</p>
                                <p>{member?.relationship || '-'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <p className='text-gray-500'>{content['position']}</p>
                                <p>{member?.position || "-"}</p>

                                <p className='text-gray-500'>{content['phone']}</p>
                                <p>{member?.phone || "-"}</p>
                            </div>
                        </div>
                        {familyMember.length > 1 && index !== familyMember.length - 1 && (
                            <Divider />
                        )}
                    </div>
                ))}
            </Card>
        </div>
    )
}

export default TabProfile
