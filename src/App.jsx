import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import AdminDashboard from './components/dashboard/AdminDashboard'
import EmployeeDashboard from './components/dashboard/EmployeeDashboard'
import EmployeeList from './components/employees/EmployeeList'
import EmployeeForm from './components/employees/EmployeeForm'
import EmployeeProfile from './components/employees/EmployeeProfile'
import DepartmentList from './components/departments/DepartmentList'
import DepartmentForm from './components/departments/DepartmentForm'
import JobRoleList from './components/jobroles/JobRoleList'
import JobRoleForm from './components/jobroles/JobRoleForm'
import LeaveList from './components/leaves/LeaveList'
import LeaveForm from './components/leaves/LeaveForm'
import LeaveApproval from './components/leaves/LeaveApproval'
import PayrollList from './components/payroll/PayrollList'
import PayrollForm from './components/payroll/PayrollForm'
import PayrollDetails from './components/payroll/PayrollDetails'

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Navigate to="/dashboard" replace />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/employee-dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Employee Management */}
          <Route path="/employees" element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/employees/new" element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/employees/edit/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/employees/profile/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeProfile />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Department Management */}
          <Route path="/departments" element={
            <ProtectedRoute>
              <AppLayout>
                <DepartmentList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/departments/new" element={
            <ProtectedRoute>
              <AppLayout>
                <DepartmentForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/departments/edit/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <DepartmentForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Job Role Management */}
          <Route path="/jobroles" element={
            <ProtectedRoute>
              <AppLayout>
                <JobRoleList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/jobroles/new" element={
            <ProtectedRoute>
              <AppLayout>
                <JobRoleForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/jobroles/edit/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <JobRoleForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Leave Management */}
          <Route path="/leaves" element={
            <ProtectedRoute>
              <AppLayout>
                <LeaveList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/leaves/new" element={
            <ProtectedRoute>
              <AppLayout>
                <LeaveForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/leaves/approval" element={
            <ProtectedRoute>
              <AppLayout>
                <LeaveApproval />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Payroll Management */}
          <Route path="/payroll" element={
            <ProtectedRoute>
              <AppLayout>
                <PayrollList />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/payroll/new" element={
            <ProtectedRoute>
              <AppLayout>
                <PayrollForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/payroll/details/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <PayrollDetails />
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App