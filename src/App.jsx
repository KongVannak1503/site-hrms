import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import Dashboard from './routes/defaults/dashboard'
import Test from './routes/defaults/Test'
import TableSample from './routes/defaults/TableSample'
import Users from './routes/settings/user/Users'
import LoginPage from './routes/defaults/LoginPage'
import ProtectedRoute from './components/hooks/ProtectedRoute'
import NotFound from './components/hooks/NotFound'
import Authorized from './components/hooks/Authorized'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route ProtectedRoute
            path="/dashboard" element={
              <ProtectedRoute requiredRoute="/api/dashboard" requiredAction="view">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/test" element={<Test />} />
          <Route path="/table" element={<TableSample />} />
          <Route
            path="/setting/users"
            element={
              <ProtectedRoute requiredRoute="/api/users" requiredAction="view">
                <Users />
              </ProtectedRoute>
            } />
        </Route>
        <Route path="/unauthorized" element={<Authorized />} />
        {/* Catch-all route for unmatched URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
