import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import Dashboard from './routes/defaults/dashboard'
import Test from './routes/defaults/Test'
import { LanguageProvider } from './components/Translate/LanguageContext'
import TableSample from './routes/defaults/TableSample'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test" element={<Test />} />
            <Route path="/table" element={<TableSample />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
