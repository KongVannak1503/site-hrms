import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import Dashboard from './routes/defaults/dashboard'
import Test from './routes/defaults/Test'
import TableSample from './routes/defaults/TableSample'
import LoginPage from './routes/defaults/LoginPage'
import ProtectedRoute from './components/hooks/ProtectedRoute'
import NotFound from './components/hooks/NotFound'
import Authorized from './components/hooks/Authorized'
import RolesPage from './routes/settings/role/RolesPage'
import UsersPage from './routes/settings/user/UsersPage'
import UploadForm from './routes/defaults/UploadForm'
import PositionPage from './routes/settings/position/PositionPage'
import CategoryPage from './routes/settings/category/CategoryPage'
import SkillPage from './routes/settings/Skill/SkillPage'
import DepartmentPage from './routes/settings/department/DepartmentPage'
import OrganizationPage from './routes/settings/organization/OrganizationPage'
import EmployeePage from './routes/employee/EmployeePage'

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
