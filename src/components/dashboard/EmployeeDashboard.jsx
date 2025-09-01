import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardCard from './DashboardCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { employeeService } from '../../services/employeeService'
import { leaveService } from '../../services/leaveService'
import { payrollService } from '../../services/payrollService'
import { formatDate, formatCurrency, getStatusBadgeClass, getErrorMessage } from '../../utils/helpers'

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null)
  const [dashboardStats, setDashboardStats] = useState({
    leaveBalance: 0,
    pendingLeaves: 0,
    recentPayrolls: 0,
    totalLeavesTaken: 0
  })
  const [recentLeaves, setRecentLeaves] = useState([])
  const [recentPayrolls, setRecentPayrolls] = useState([])
  const [aiWelcomeMessage, setAiWelcomeMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
      fetchAIWelcome()
    }
  }, [user])

const fetchAIWelcome = async () => {
  try {
const response = await fetch('http://localhost:8080/api/v1/auth/welcome-message', {      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'text/plain'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    if (response.ok) {
      setAiWelcomeMessage(text);
    } else {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
  } catch (error) {
    console.error('Failed to fetch AI message:', error);
    // Fallback message based on time of day
    const hour = new Date().getHours();
    let greeting = "Good day!";
    if (hour < 12) greeting = "Good morning!";
    else if (hour < 17) greeting = "Good afternoon!";
    else greeting = "Good evening!";
    
    setAiWelcomeMessage(`${greeting} Ready to make today productive?`);
  }
};

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get employee data
      const employee = await employeeService.getEmployeeByUserId(user.id)
      setEmployeeData(employee)

      // Get leave requests
      const leaves = await leaveService.getLeaveRequestsByEmployee(employee.employeeId)
      const pendingLeaves = leaves.filter(leave => leave.status === 'PENDING')
      const approvedLeaves = leaves.filter(leave => leave.status === 'APPROVED')
      
      setRecentLeaves(leaves.slice(0, 3))

      // Get payroll data
      const payrolls = await payrollService.getPayrollsByEmployee(employee.employeeId)
      setRecentPayrolls(payrolls.slice(0, 3))

      setDashboardStats({
        leaveBalance: employee.leaveBalance || 0,
        pendingLeaves: pendingLeaves.length,
        recentPayrolls: payrolls.filter(p => 
          new Date(p.generatedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        totalLeavesTaken: approvedLeaves.length
      })

    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-link p-0 ms-2" onClick={loadDashboardData}>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-gradient">Welcome, {employeeData?.firstName}!</h1>
          <p className="text-muted mb-0">{employeeData?.jobTitle || 'Employee'} • {employeeData?.departmentName || 'No Department'}</p>
        </div>
        <div className="text-muted">
          <i className="bi bi-calendar3 me-2"></i>
          {formatDate(new Date())}
        </div>
      </div>

      {aiWelcomeMessage && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-info border-0" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-robot me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h6 className="mb-1">🤖 AI Assistant</h6>
                  <p className="mb-0">{aiWelcomeMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <DashboardCard
            title="Leave Balance"
            value={dashboardStats.leaveBalance}
            icon="bi-calendar-heart"
            color="success"
            subtitle="Days remaining"
          />
        </div>
        <div className="col-md-3">
          <DashboardCard
            title="Pending Leaves"
            value={dashboardStats.pendingLeaves}
            icon="bi-hourglass-split"
            color="warning"
            onClick={() => navigate('/leaves')}
            subtitle="Awaiting approval"
          />
        </div>
        <div className="col-md-3">
          <DashboardCard
            title="Recent Payrolls"
            value={dashboardStats.recentPayrolls}
            icon="bi-cash-coin"
            color="primary"
            onClick={() => navigate('/payroll')}
            subtitle="Last 30 days"
          />
        </div>
        <div className="col-md-3">
          <DashboardCard
            title="Leaves Taken"
            value={dashboardStats.totalLeavesTaken}
            icon="bi-check-circle"
            color="info"
            subtitle="This year"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-lightning-fill me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-primary w-100 p-3"
                    onClick={() => navigate('/leaves/new')}
                  >
                    <i className="bi bi-calendar-plus fs-4 d-block mb-2"></i>
                    Apply for Leave
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-success w-100 p-3"
                    onClick={() => navigate('/payroll')}
                  >
                    <i className="bi bi-file-earmark-text fs-4 d-block mb-2"></i>
                    View Payslips
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-info w-100 p-3"
                    onClick={() => navigate(`/employees/profile/${employeeData?.employeeId}`)}
                  >
                    <i className="bi bi-person-circle fs-4 d-block mb-2"></i>
                    My Profile
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-warning w-100 p-3"
                    onClick={() => navigate('/leaves')}
                  >
                    <i className="bi bi-clock-history fs-4 d-block mb-2"></i>
                    Leave History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Recent Leave Requests
              </h5>
            </div>
            <div className="card-body">
              {recentLeaves.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentLeaves.map((leave) => (
                    <div key={leave.leaveId} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{leave.leaveType}</h6>
                          <p className="mb-1 text-muted small">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                          <span className={getStatusBadgeClass(leave.status)}>
                            {leave.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-calendar-x fs-1 d-block mb-3 opacity-50"></i>
                  <p>No leave requests</p>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate('/leaves/new')}
                  >
                    Apply for Leave
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {recentPayrolls.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  Recent Payslips
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayrolls.map((payroll) => (
                        <tr key={payroll.payrollId}>
                          <td>
                            <strong>{payroll.month}/{payroll.year}</strong>
                          </td>
                          <td>{formatCurrency(payroll.baseSalary)}</td>
                          <td>{formatCurrency(payroll.allowances)}</td>
                          <td>{formatCurrency(payroll.deductions)}</td>
                          <td>
                            <strong className="text-success">
                              {formatCurrency(payroll.netSalary)}
                            </strong>
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(payroll.status)}>
                              {payroll.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/payroll/details/${payroll.payrollId}`)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboard