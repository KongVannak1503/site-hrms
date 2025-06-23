import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import Dashboard from './pages/defaults/dashboard'
import Test from './pages/defaults/Test'
import TableSample from './pages/defaults/TableSample'
import LoginPage from './pages/defaults/LoginPage'
import ProtectedRoute from './components/hooks/ProtectedRoute'
import NotFound from './components/hooks/NotFound'
import Authorized from './components/hooks/Authorized'
import RolesPage from './pages/settings/role/RolesPage'
import UsersPage from './pages/settings/user/UsersPage'
import UploadForm from './pages/defaults/UploadForm'
import PositionPage from './pages/settings/position/PositionPage'
import CategoryPage from './pages/settings/category/CategoryPage'
import SkillPage from './pages/settings/Skill/SkillPage'
import DepartmentPage from './pages/settings/department/DepartmentPage'
import OrganizationPage from './pages/settings/organization/OrganizationPage'
import EmployeePage from './pages/employee/EmployeePage'

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
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/test" element={<Test />} />
            <Route path="/table" element={<TableSample />} />
            <Route
              path="/setting/users"
              element={
                <UsersPage />
              } />
            <Route
              path="/setting/roles"
              element={
                <RolesPage />
              } />
            <Route
              path="/setting/positions"
              element={
                <PositionPage />
              } />
            <Route
              path="/setting/categories"
              element={
                <CategoryPage />
              } />
            <Route
              path="/setting/skills"
              element={
                <SkillPage />
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
