import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { employeeService } from '../../services/employeeService'
import { leaveService } from '../../services/leaveService'
import { payrollService } from '../../services/payrollService'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatDate, formatCurrency, getStatusBadgeClass, getErrorMessage } from '../../utils/helpers'

const EmployeeProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [employee, setEmployee] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEmployeeData()
  }, [id])

  const loadEmployeeData = async () => {
    try {
      setLoading(true)
      const employeeData = await employeeService.getEmployeeById(id)

      const [leaveData, payrollData] = await Promise.all([
        leaveService.getLeaveRequestsByEmployee(id).catch(() => []),
        payrollService.getPayrollsByEmployee(id).catch(() => [])
      ])

      setEmployee(employeeData)
      setLeaves(leaveData.slice(0, 5))
      setPayrolls(payrollData.slice(0, 5))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading employee profile..." />
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-link p-0 ms-2" onClick={loadEmployeeData}>
          Try again
        </button>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-5">
        <h5>Employee not found</h5>
        <button className="btn btn-primary" onClick={() => navigate('/employees')}>
          Back to Employees
        </button>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">Employee Profile</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(`/employees/edit/${id}`)}
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Profile
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/employees')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body text-center">
              <div
                className="avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                {employee.firstName?.charAt(0)}
                {employee.lastName?.charAt(0)}
              </div>
              <h4 className="mb-1">
                {employee.firstName} {employee.lastName}
              </h4>
              <p className="text-muted mb-3">{employee.jobTitle || 'No Job Title'}</p>
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="border-end">
                    <div className="fw-bold text-success fs-4">{employee.leaveBalance || 0}</div>
                    <small className="text-muted">Leave Days</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-primary fs-4">{leaves.length}</div>
                  <small className="text-muted">Requests</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">Contact Information</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <strong>Employee ID:</strong>
                  <br />
                  <span className="text-muted">{employee.employeeId}</span>
                </div>
                {employee.phoneNumber && (
                  <div className="list-group-item border-0 px-0">
                    <strong>Phone:</strong>
                    <br />
                    <span className="text-muted">{employee.phoneNumber}</span>
                  </div>
                )}
                {employee.address && (
                  <div className="list-group-item border-0 px-0">
                    <strong>Address:</strong>
                    <br />
                    <span className="text-muted">{employee.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-badge me-2"></i>
                Employee Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <strong>Department:</strong>
                  <br />
                  <span className="text-muted">{employee.departmentName || 'Not assigned'}</span>
                </div>
                <div className="col-md-6">
                  <strong>Job Title:</strong>
                  <br />
                  <span className="text-muted">{employee.jobTitle || 'Not assigned'}</span>
                </div>
                <div className="col-md-6">
                  <strong>Hire Date:</strong>
                  <br />
                  <span className="text-muted">{formatDate(employee.hireDate)}</span>
                </div>
                {employee.dateOfBirth && (
                  <div className="col-md-6">
                    <strong>Date of Birth:</strong>
                    <br />
                    <span className="text-muted">{formatDate(employee.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leave Requests */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Recent Leave Requests
              </h5>
            </div>
            <div className="card-body">
              {leaves.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((leave) => (
                        <tr key={leave.leaveId}>
                          <td>
                            <span className="badge bg-light text-dark">{leave.leaveType}</span>
                          </td>
                          <td>
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(leave.status)}>{leave.status}</span>
                          </td>
                          <td>{formatDate(leave.appliedDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-calendar-x fs-1 d-block mb-3 opacity-50"></i>
                  <p>No leave requests found</p>
                </div>
              )}
            </div>
          </div>

          {/* Payrolls */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-cash-stack me-2"></i>
                Recent Payrolls
              </h5>
            </div>
            <div className="card-body">
              {payrolls.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                        <th>Generated Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls.map((payroll) => (
                        <tr key={payroll.payrollId}>
                          <td>
                            <strong>
                              {payroll.month}/{payroll.year}
                            </strong>
                          </td>
                          <td>{formatCurrency(payroll.baseSalary)}</td>
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
                          <td>{formatDate(payroll.generatedDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-receipt fs-1 d-block mb-3 opacity-50"></i>
                  <p>No payroll records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile
