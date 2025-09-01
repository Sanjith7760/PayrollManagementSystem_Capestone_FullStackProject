import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardCard from './DashboardCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { employeeService } from '../../services/employeeService'
import { leaveService } from '../../services/leaveService'
import { payrollService } from '../../services/payrollService'
import { formatDate, getErrorMessage } from '../../utils/helpers'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    recentPayrolls: 0,
    activeEmployees: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [aiWelcomeMessage, setAiWelcomeMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
    fetchAIWelcome()
  }, [])

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
      const [employees, pendingLeaves, payrolls] = await Promise.all([
        employeeService.getAllEmployees(),
        leaveService.getPendingLeaveRequests(),
        payrollService.getAllPayrolls()
      ])

      setDashboardData({
        totalEmployees: employees.length,
        pendingLeaves: pendingLeaves.length,
        recentPayrolls: payrolls.filter(p => 
          new Date(p.generatedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        activeEmployees: employees.filter(e => e.leaveBalance > 0).length
      })

      // Mock recent activities (you can replace with actual data)
      setRecentActivities([
        { id: 1, type: 'leave', message: 'New leave request submitted', time: new Date() },
        { id: 2, type: 'payroll', message: 'Payroll processed for March', time: new Date() },
        { id: 3, type: 'employee', message: 'New employee onboarded', time: new Date() }
      ])

    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
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
        <h1 className="h3 mb-0 text-gradient">Admin Dashboard</h1>
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
            title="Total Employees"
            value={dashboardData.totalEmployees}
            icon="bi-people-fill"
            color="primary"
            onClick={() => navigate('/employees')}
            trend={{ positive: true, value: 12 }}
          />
        </div>
        <div className="col-md-3">
          <DashboardCard
            title="Pending Leaves"
            value={dashboardData.pendingLeaves}
            icon="bi-calendar-check"
            color="warning"
            onClick={() => navigate('/leaves/approval')}
            subtitle="Awaiting approval"
          />
        </div>
        <div className="col-md-3">
          <DashboardCard
            title="Recent Payrolls"
            value={dashboardData.recentPayrolls}
            icon="bi-cash-stack"
            color="success"
            onClick={() => navigate('/payroll')}
            subtitle="Last 30 days"
          />
        </div>
        <div className="col-md-3">
          <DashboardCard
            title="Active Employees"
            value={dashboardData.activeEmployees}
            icon="bi-person-check"
            color="info"
            subtitle="With leave balance"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-primary w-100 p-3"
                    onClick={() => navigate('/employees/new')}
                  >
                    <i className="bi bi-person-plus-fill fs-4 d-block mb-2"></i>
                    Add New Employee
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-success w-100 p-3"
                    onClick={() => navigate('/payroll/new')}
                  >
                    <i className="bi bi-cash-stack fs-4 d-block mb-2"></i>
                    Generate Payroll
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-warning w-100 p-3"
                    onClick={() => navigate('/leaves/approval')}
                  >
                    <i className="bi bi-check-circle fs-4 d-block mb-2"></i>
                    Approve Leaves
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-info w-100 p-3"
                    onClick={() => navigate('/departments/new')}
                  >
                    <i className="bi bi-building-add fs-4 d-block mb-2"></i>
                    Add Department
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
                <i className="bi bi-clock-history me-2"></i>
                Recent Activities
              </h5>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex align-items-start">
                        <div className={`badge bg-${
                          activity.type === 'leave' ? 'warning' : 
                          activity.type === 'payroll' ? 'success' : 'primary'
                        } me-3 mt-1`}>
                          <i className={`bi ${
                            activity.type === 'leave' ? 'bi-calendar' : 
                            activity.type === 'payroll' ? 'bi-cash' : 'bi-person'
                          }`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1">{activity.message}</p>
                          <small className="text-muted">{formatDate(activity.time)}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard