import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { leaveService } from '../../services/leaveService'
import { employeeService } from '../../services/employeeService'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatDate, getStatusBadgeClass, getErrorMessage, filterBy } from '../../utils/helpers'
import { ROLES } from '../../utils/constants'

const LeaveList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === ROLES.ADMIN

  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
   const [employees, setEmployees] = useState({});


  useEffect(() => {
    loadLeaves()
  }, [user])

  useEffect(() => {
    if (isAdmin) {
        // Fetch all employees to get names
        employeeService.getAllEmployees()
            .then(employeeList => {
                const employeeMap = {};
                employeeList.forEach(emp => {
                    employeeMap[emp.employeeId] = `${emp.firstName} ${emp.lastName}`;
                });
                setEmployees(employeeMap);
            })
            .catch(err => console.error('Failed to fetch employees:', err));
    }
}, [isAdmin]);

  useEffect(() => {
    let filtered = leaves
    
    if (searchTerm) {
      filtered = filterBy(filtered, searchTerm, ['leaveType', 'reason', 'aiMessage'])
    }
    
    if (filterStatus) {
      filtered = filtered.filter(leave => leave.status === filterStatus)
    }
    
    setFilteredLeaves(filtered)
  }, [leaves, searchTerm, filterStatus])

  const loadLeaves = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (isAdmin) {
        const data = await leaveService.getAllLeaveRequests()
        setLeaves(data)
      } else {
        const employee = await employeeService.getEmployeeByUserId(user.id)
        const data = await leaveService.getLeaveRequestsByEmployee(employee.employeeId)
        setLeaves(data)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading leave requests..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">
          {isAdmin ? 'Leave Management' : 'My Leave Requests'}
        </h1>
        <Link to="/leaves/new" className="btn btn-primary">
          <i className="bi bi-calendar-plus me-2"></i>
          Apply for Leave
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Leave Requests ({filteredLeaves.length})
              </h5>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search leaves..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
              <h5>No leave requests found</h5>
              <p className="text-muted">
                {searchTerm || filterStatus ? 'Try adjusting your filters' : 'Start by applying for leave'}
              </p>
              {!searchTerm && !filterStatus && (
                <Link to="/leaves/new" className="btn btn-primary">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Apply for Leave
                </Link>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    {isAdmin && <th>Employee</th>}
                    <th>Leave Type</th>
                    <th>Period</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>AI Insights</th> 
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.leaveId}>
                      {isAdmin && (
                         <td>
                              < div className="fw-semibold">
                                {leave.employeeName || `Employee #${leave.employeeId}`}
                              </div>
                           </td>
                      )}
                      <td>
                        <span className="badge bg-light text-dark">{leave.leaveType}</span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">{formatDate(leave.startDate)}</div>
                          <small className="text-muted">to {formatDate(leave.endDate)}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(leave.status)}>
                          {leave.status}
                        </span>
                      </td>
                      <td>{formatDate(leave.appliedDate)}</td>
                      <td>
                        {leave.aiMessage ? (
                          <span className="text-muted">{leave.aiMessage}</span>
                        ) : (
                          <span className="text-secondary fst-italic">No insights</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-info"
                            onClick={() => {
                              alert(`Leave Details:\nType: ${leave.leaveType}\nReason: ${leave.reason}`)
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {leave.status === 'PENDING' && !isAdmin && (
                            <button
                              className="btn btn-outline-danger"
                              onClick={async () => {
                                if (confirm('Are you sure you want to cancel this leave request?')) {
                                  try {
                                    await leaveService.deleteLeaveRequest(leave.leaveId)
                                    loadLeaves()
                                  } catch (err) {
                                    setError(getErrorMessage(err))
                                  }
                                }
                              }}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaveList
