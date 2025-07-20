import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import Dashboard from './pages/defaults/dashboard'
import Test from './pages/defaults/Test'
import TableSample from './pages/defaults/TableSample'
import LoginPage from './pages/login/LoginPage'
import RolesPage from './pages/settings/role/RolesPage'
import UsersPage from './pages/settings/user/UsersPage'
import UploadForm from './pages/defaults/UploadForm'
import CategoryPage from './pages/settings/category/CategoryPage'
import SkillPage from './pages/settings/Skill/SkillPage'
import DepartmentPage from './pages/settings/department/DepartmentPage'
import OrganizationPage from './pages/settings/organization/OrganizationPage'
import EmployeePage from './pages/employee/EmployeePage'
import Authorized from './components/errors/Authorized'
import NotFound from './components/errors/NotFound'
import ProtectedRoute from './hooks/ProtectedRoute'
import EmployeeCreatePage from './pages/employee/EmployeeCreatePage'
import CityPage from './pages/settings/employee/city/CityPage'
import DistrictPage from './pages/settings/employee/district/DistrictPage'
import CommunePage from './pages/settings/employee/commune/CommunePage'
import VillagePage from './pages/settings/employee/village/VillagePage'
import EmployeeUpdatePage from './pages/employee/EmployeeUpdatePage'
import EducationLevelPage from './pages/settings/employee/education-lavel/EducationLevelPage'

import JobPostingPage from './pages/recruitment/jobposting/JobPostingPage'
import ApplicantPage from './pages/recruitment/applicants/ApplicantPage'
import CreateJobPostingPage from './pages/recruitment/jobposting/CreateJobPostingPage'
import JobTypePage from './pages/settings/jobType/JobTypePage'
import PositionPage from './pages/settings/position/PositionPage'
import UpdateJobPostingPage from './pages/recruitment/jobposting/UpdateJobPostingPage'
import CreateApplicantPage from './pages/recruitment/applicants/CreateApplicantPage'

import EmployeeDocumentPage from './pages/employee/document/EmployeeDocumentPage'
import EmployeeEducationTab from './pages/employee/EmployeeEducationTab'
import EmployeeHistoryPage from './pages/employee/EmployeeHistoryPage'
import DocumentList from './pages/employee/document/DocumentList'
import EditApplicantPage from './pages/recruitment/applicants/EditApplicantPage'
import EmployeeDocumentPages from './pages/employee/document/EmployeeDocumentPages'
import EmployeeBookPage from './pages/employee/book/EmployeeBookPage'
import LaborLawPage from './pages/employee/law/LaborLawPage'
import NSSFPage from './pages/employee/book/NSSFPage'
import PayrollPage from './pages/employee/payroll/PayrollPage'

import TestTypePage from './pages/recruitment/tests/TestTypePage'
import TestSchedulePage from './pages/recruitment/tests/TestSchedulePage'
import TestDetailPage from './pages/recruitment/tests/TestDetailPage'

import EmployeePositionPage from './pages/employee/position/EmployeePositionPage'
import SubPayrollPage from './pages/employee/payroll/sub-payroll/SubPayrollPage'
import InterviewPage from './pages/recruitment/interviews/InterviewPage'

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route path="/" element={<Dashboard />} />
            <Route
              path="/dashboard" element={
                <Dashboard />
              }
            />
            {/* Recruitment */}
            <Route path="/job-postings" element={<JobPostingPage />} />
            <Route path="/job-postings/create" element={<CreateJobPostingPage />} />
            <Route path="/job-postings/edit/:id" element={<UpdateJobPostingPage />} />

            <Route path="/applicants" element={<ApplicantPage />} />
            <Route path="/applicants/create" element={<CreateApplicantPage />} />
            <Route path="/applicants/edit/:id" element={<EditApplicantPage />} />

            <Route path="/test-schedules" element={<TestSchedulePage />} />
            <Route path="/test-schedules/:id" element={<TestDetailPage />} />
            <Route path="/test-types" element={<TestTypePage />} />

            <Route path='/interview-schedules' element={<InterviewPage />}/>

            {/* Employee */}
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/employee/document1" element={<EmployeeDocumentPage />} />
            <Route path="/employee/profile/:id" element={<EmployeeUpdatePage />} />
            <Route path="/employee/update/:id" element={<EmployeeUpdatePage />} />
            <Route path="/employee/education/:id" element={<EmployeeEducationTab />} />
            <Route path="/employee/history/:id" element={<EmployeeHistoryPage />} />
            <Route path="/employee/document/:id" element={<EmployeeDocumentPages />} />
            <Route path="/employee/book/:id" element={<EmployeeBookPage />} />
            <Route path="/employee/law/:id" element={<LaborLawPage />} />
            <Route path="/employee/nssf/:id" element={<NSSFPage />} />
            <Route path="/employee/position/:id" element={<EmployeePositionPage />} />
            <Route path="/employee/document-list/:id" element={<DocumentList />} />
            <Route path="/employee/create" element={<EmployeeCreatePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/payroll/:id" element={<SubPayrollPage />} />
            <Route path="/test" element={<Test />} />
            <Route path="/table" element={<TableSample />} />

            {/* Appraisal */}
            <Route path="/appraisal" element={<TableSample />} />

            {/* Awarding */}
            <Route path="/awarding" element={<TableSample />} />

            <Route
              path="/setting/user/index"
              element={
                <UsersPage />
              } />
            <Route
              path="/setting/user/role"
              element={
                <RolesPage />
              } />

            <Route
              path="/setting/categories"
              element={
                <CategoryPage />
              } />
            <Route
              path="/setting/job-types"
              element={
                <JobTypePage />
              } />
            <Route
              path="/setting/employee/level"
              element={
                <EducationLevelPage />
              } />
            <Route
              path="/setting/employee/city"
              element={
                <CityPage />
              } />
            <Route
              path="/setting/employee/district"
              element={
                <DistrictPage />
              } />
            <Route
              path="/setting/employee/commune"
              element={
                <CommunePage />
              } />
            <Route
              path="/setting/employee/village"
              element={
                <VillagePage />
              } />
            <Route
              path="/setting/Organization"
              element={
                <OrganizationPage />
              } />
            <Route
              path="/setting/Departments"
              element={
                <DepartmentPage />
              } />

            <Route
              path="/setting/positions"
              element={
                <PositionPage />
              } />

            <Route
              path="/upload"
              element={
                <UploadForm />
              } />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Authorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
