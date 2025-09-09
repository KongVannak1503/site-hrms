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
import EmployeeTimeLinePage from './pages/employee/payroll/EmployeeTimeLinePage'
import { useAuth } from './contexts/AuthContext'
import { ADMIN, EMPLOYEE, MANAGER } from './data/Type'
import RolesMainPage from './pages/settings/role/RolesMainPage'
import EmployeeManagerPage from './pages/employee/EmployeeManagerPage'
import KpiPage from './pages/appraisals/KpiPage'
import KpiTemplateBuilder from './pages/appraisals/KpiTemplateBuilder'
import KpiTemplateBuilderEditPage from './pages/appraisals/KpiTemplateBuilderEditPage'
import AppraisalMonthPage from './pages/appraisals/appraisal_month/AppraisalMonthPage'
import EmployeeAppraisalPage from './pages/employee/book/Appraisal/EmployeeAppraisalPage'
import AppraisalYearPage from './pages/appraisals/appraisal_year/AppraisalYearPage'
import AppraisalYearListPage from './pages/appraisals/appraisal_year/AppraisalYearListPage'
import AppraisalYearFormPage from './pages/appraisals/appraisal_year/AppraisalYearFormPage'
import KpiMonthPage from './pages/appraisals/kpi-month/KpiMonthPage'
import KpiTemplateMonthBuilder from './pages/appraisals/kpi-month/KpiTemplateMonthBuilder'
import KpiTemplateBuilderMonthEditPage from './pages/appraisals/kpi-month/KpiTemplateBuilderMonthEditPage'
// import AppraisalMonthListPage from './pages/appraisals/appraisal_month/AppraisalMonthListPage'
// import AppraisalMonthFormPage from './pages/appraisals/appraisal_month/AppraisalMonthFormPage'
import KpiDayPage from './pages/appraisals/kpi-day/KpiDayPage'
import KpiTemplateDayBuilder from './pages/appraisals/kpi-day/KpiTemplateDayBuilder'
import KpiTemplateBuilderDayEditPage from './pages/appraisals/kpi-day/KpiTemplateBuilderDayEditPage'
import AppraisalDayPage from './pages/appraisals/appraisal_day/AppraisalDayPage'
import AppraisalDayListPage from './pages/appraisals/appraisal_day/AppraisalDayListPage'
import AppraisalDayFormPage from './pages/appraisals/appraisal_day/AppraisalDayFormPage'
import AppraisalYearListEmpPage from './pages/appraisals/appraisal_year_emp/AppraisalYearListEmpPage'
import AppraisalYearFormEmpPage from './pages/appraisals/appraisal_year_emp/AppraisalYearFormEmpPage'
import FullScreenLoader from './components/loading/FullScreenLoader'
import JobPostingDetailPage from './pages/recruitment/jobposting/JobPostingDetailPage'
import ApplicantDetailPage from './pages/recruitment/applicants/ApplicantDetailPage'
import AppraisalEmployeePage from './pages/appraisals/appraisal_day/AppraisalEmployeePage'
import AppraisalEmployeeListPage from './pages/appraisals/appraisal_day/AppraisalEmployeeListPage'
import AppraisalEmployeeFormPage from './pages/appraisals/appraisal_day/AppraisalEmployeeFormPage'
import AppraisalAdminFormPage from './pages/appraisals/appraisal_day/AppraisalAdminFormPage'
import AppraisalManagerFormPage from './pages/appraisals/appraisal_day/AppraisalManagerFormPage'
import AppraisalMonthEmployeeFormPage from './pages/appraisals/appraisal_month/AppraisalMonthEmployeeFormPage'
import AppraisalMonthAdminFormPage from './pages/appraisals/appraisal_month/AppraisalMonthAdminFormPage'
import AppraisalMonthManagerFormPage from './pages/appraisals/appraisal_month/AppraisalMonthManagerFormPage'
import AppraisalMonthEmployeePage from './pages/appraisals/appraisal_month/AppraisalMonthEmployeePage'
import AppraisalMonthEmployeeListPage from './pages/appraisals/appraisal_month/AppraisalMonthEmployeeListPage'
import EmployeeViewPage from './pages/employee/EmployeeViewPage'
import EpmReportPdf from './pages/employee/report/EpmReportPdf'
import ReportTest from './pages/employee/report/ReportTest'
import ReportTestDocx from './pages/employee/report/ReportTestDocx'
import ReportEmployeePage from './pages/employee/report/employee/ReportEmployeePage'
import ReportRecruitmentPage from './pages/employee/report/recruitment/ReportRecruitmentPage'
import ReportAppraisalPage from './pages/employee/report/appraisal/ReportAppraisalPage'
import AppraisalMonthManagerFormPartPage from './pages/appraisals/appraisal_month/appraisal_path/AppraisalMonthManagerFormPartPage'
import AppraisalMonthEmployeeFormPartPage from './pages/appraisals/appraisal_month/appraisal_path/AppraisalMonthEmployeeFormPartPage'
import AppraisalMonthEmployeeListPathPage from './pages/appraisals/appraisal_month/appraisal_path/AppraisalMonthEmployeeListPathPage'
import AppraisalMonthManagerListPathPage from './pages/appraisals/appraisal_month/appraisal_path/AppraisalMonthManagerListPathPage'
import AppraisalMonthEmployeePathPage from './pages/appraisals/appraisal_month/appraisal_path/AppraisalMonthEmployeePathPage'
import AppraisalRecentlyListPage from './pages/appraisals/appraisal_day/AppraisalRecentlyListPage'

function App() {
  const { isLoading } = useAuth();
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
            <Route path="/job-postings/view/:id" element={<JobPostingDetailPage />} />

            <Route path="/applicants" element={<ApplicantPage />} />
            <Route path="/applicants/create" element={<CreateApplicantPage />} />
            <Route path="/applicants/edit/:id" element={<EditApplicantPage />} />
            <Route path="/applicants/view/:id" element={<ApplicantDetailPage />} />

            <Route path="/test-schedules" element={<TestSchedulePage />} />
            <Route path="/test-schedules/:id" element={<TestDetailPage />} />
            <Route path="/setting/test-types" element={<TestTypePage />} />

            <Route path='/interview-schedules' element={<InterviewPage />} />

            <Route path="/employee/kpi/appraisal/:id" element={<EmployeeAppraisalPage />} />

            {/* Employee */}
            {/* {identity?.role?.name === ADMIN && ( */}
            <>
              <Route path="/employee" element={<EmployeePage />} />
              <Route path="/employee/view/:id" element={<EmployeeViewPage />} />
              {/* Appraisal */}
              <Route
                path="/appraisal/kpi"
                element={
                  <KpiPage />
                } />
              <Route
                path="/appraisal/kpi/year/form"
                element={
                  <KpiTemplateBuilder />
                } />
              <Route
                path="/appraisal/kpi/year/update/:id"
                element={
                  <KpiTemplateBuilderEditPage />
                } />
              <Route
                path="/appraisal"
                element={
                  <AppraisalMonthPage />
                } />
              <Route
                path="/appraisal/year"
                element={
                  <AppraisalYearPage />
                } />
              <Route
                path="/appraisal/year/:id"
                element={
                  <AppraisalYearListPage />
                } />
              <Route
                path="/appraisal/year/:mainId/form/:id"
                element={
                  <AppraisalYearFormPage />
                } />
              {/* month */}
              <Route
                path="/appraisal/kpi/month"
                element={
                  <KpiMonthPage />
                } />

              <Route
                path="/appraisal/day/employee"
                element={
                  <AppraisalEmployeePage />
                } />
              <Route
                path="/appraisal/day/employee/list/:mainId"
                element={
                  <AppraisalEmployeeListPage />
                } />
              <Route
                path="/appraisal/day/admin/:mainId/form/:id"
                element={
                  <AppraisalAdminFormPage />
                } />
              <Route
                path="/appraisal/day/manager/:mainId/form/:id"
                element={
                  <AppraisalManagerFormPage />
                } />
              <Route
                path="/appraisal/day/employee/:mainId/form/:id"
                element={
                  <AppraisalEmployeeFormPage />
                } />
              {/* month */}
              <Route
                path="/appraisal/employee"
                element={
                  <AppraisalMonthEmployeePage />
                } />
              <Route
                path="/appraisal/employee/path"
                element={
                  <AppraisalMonthEmployeePathPage />
                } />
              <Route
                path="/appraisal/employee/list/:mainId"
                element={
                  <AppraisalMonthEmployeeListPage />
                } />
              <Route
                path="/appraisal/recently"
                element={
                  <AppraisalRecentlyListPage />
                } />
              <Route
                path="/appraisal/employee/list/path/:mainId"
                element={
                  <AppraisalMonthEmployeeListPathPage />
                } />
              <Route
                path="/appraisal/employee/list/path-m/:mainId"
                element={
                  <AppraisalMonthManagerListPathPage />
                } />

              <Route
                path="/appraisal/month/admin/:mainId/form/:id"
                element={
                  <AppraisalMonthAdminFormPage />
                } />
              <Route
                path="/appraisal/month/manager/path/:mainId/form/:id"
                element={
                  <AppraisalMonthManagerFormPartPage />
                } />
              <Route
                path="/appraisal/month/employee/path/:mainId/form/:id"
                element={
                  <AppraisalMonthEmployeeFormPartPage />
                } />
              <Route />
              <Route
                path="/appraisal/month/manager/:mainId/form/:id"
                element={
                  <AppraisalMonthManagerFormPage />
                } />
              <Route
                path="/appraisal/month/employee/:mainId/form/:id"
                element={
                  <AppraisalMonthEmployeeFormPage />
                } />
              <Route
                path="/appraisal/kpi/month/form"
                element={
                  <KpiTemplateMonthBuilder />
                } />
              <Route
                path="/appraisal/kpi/month/update/:id"
                element={
                  <KpiTemplateBuilderMonthEditPage />
                } />
              {/* <Route
                  path="/appraisal/month/:id"
                  element={
                    <AppraisalMonthListPage />
                  } />
                <Route
                  path="/appraisal/month/:mainId/form/:id"
                  element={
                    <AppraisalMonthFormPage />
                  } /> */}
              {/*End Month */}

              {/* Day */}
              <Route
                path="/appraisal/kpi/day"
                element={
                  <KpiDayPage />
                } />

              <Route
                path="/appraisal/kpi/day/form"
                element={
                  <KpiTemplateDayBuilder />
                } />
              <Route
                path="/appraisal/kpi/day/update/:id"
                element={
                  <KpiTemplateBuilderDayEditPage />
                } />
              <Route
                path="/appraisal/day"
                element={
                  <AppraisalDayPage />
                } />
              <Route
                path="/appraisal/day/:id"
                element={
                  <AppraisalDayListPage />
                } />
              <Route
                path="/appraisal/day/:mainId/form/:id"
                element={
                  <AppraisalDayFormPage />
                } />
              {/* End Day */}
            </>

            {/* {identity?.role?.name === MANAGER && (
              <Route path="/employee" element={<EmployeeManagerPage />} />
            )}

            {identity?.role?.name === EMPLOYEE && (
              <>
                <Route
                  path="/appraisal/year/:id"
                  element={
                    <AppraisalYearListEmpPage />
                  } />
                <Route
                  path="/appraisal/year/:mainId/form/:id"
                  element={
                    <AppraisalYearFormEmpPage />
                  } />
              </>
            )} */}
            <>
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
              <Route path="/employee/time-line/:id" element={<EmployeeTimeLinePage />} />
              <Route path="/employee/document-list/:id" element={<DocumentList />} />
              <Route path="/employee/create" element={<EmployeeCreatePage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/payroll/:id" element={<SubPayrollPage />} />
              <Route path="/test" element={<Test />} />
              <Route path="/table" element={<TableSample />} />
            </>

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

            {/* <Route
              path="/setting/user/role/:action"
              element={
                <RolesPage />
              } /> */}
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

            <Route
              path="/report/employee"
              element={
                <ReportEmployeePage />
              } />
            <Route
              path="/report/recruitment"
              element={
                <ReportRecruitmentPage />
              } />
            <Route
              path="/report/appraisal"
              element={
                <ReportAppraisalPage />
              } />
          </Route>
        </Route>
        <Route
          path="/employee/exportPdf"
          element={
            <EpmReportPdf />
          } />
        <Route
          path="/test-report"
          element={
            <ReportTest />
          } />

        <Route path="/unauthorized" element={<Authorized />} />
        <Route path="*" element={isLoading ? <FullScreenLoader /> : <NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
