import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { employeeService } from '../../services/employeeService'
import LoadingSpinner from '../common/LoadingSpinner'
import ConfirmModal from '../common/ConfirmModal'
import { formatDate, getErrorMessage, filterBy, sortBy } from '../../utils/helpers'

const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState({ show: false, employee: null })
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' })

  const navigate = useNavigate()

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    let filtered = filterBy(employees, searchTerm, ['firstName', 'lastName', 'email', 'departmentName', 'jobTitle'])
    filtered = sortBy(filtered, sortConfig.key, sortConfig.direction)
    setFilteredEmployees(filtered)
  }, [employees, searchTerm, sortConfig])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await employeeService.getAllEmployees()
      setEmployees(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleDeleteEmployee = async () => {
    try {
      await employeeService.deleteEmployee(deleteModal.employee.employeeId)
      setEmployees(employees.filter(emp => emp.employeeId !== deleteModal.employee.employeeId))
      setDeleteModal({ show: false, employee: null })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return 'bi-arrow-down-up'
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
  }

  if (loading) {
    return <LoadingSpinner text="Loading employees..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">Employee Management</h1>
        <Link to="/employees/new" className="btn btn-primary">
          <i className="bi bi-person-plus me-2"></i>
          Add Employee
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
            <div className="col-md-6">
              <h5 className="card-title mb-0">
                <i className="bi bi-people me-2"></i>
                Employees ({filteredEmployees.length})
              </h5>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted d-block mb-3"></i>
              <h5>No employees found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first employee'}
              </p>
              {!searchTerm && (
                <Link to="/employees/new" className="btn btn-primary">
                  <i className="bi bi-person-plus me-2"></i>
                  Add Employee
                </Link>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th 
                      className="cursor-pointer user-select-none"
                      onClick={() => handleSort('firstName')}
                    >
                      Name <i className={`bi ${getSortIcon('firstName')} ms-1`}></i>
                    </th>
                    <th 
                      className="cursor-pointer user-select-none"
                      onClick={() => handleSort('departmentName')}
                    >
                      Department <i className={`bi ${getSortIcon('departmentName')} ms-1`}></i>
                    </th>
                    <th 
                      className="cursor-pointer user-select-none"
                      onClick={() => handleSort('jobTitle')}
                    >
                      Job Title <i className={`bi ${getSortIcon('jobTitle')} ms-1`}></i>
                    </th>
                    <th 
                      className="cursor-pointer user-select-none"
                      onClick={() => handleSort('hireDate')}
                    >
                      Hire Date <i className={`bi ${getSortIcon('hireDate')} ms-1`}></i>
                    </th>
                    <th 
                      className="cursor-pointer user-select-none"
                      onClick={() => handleSort('leaveBalance')}
                    >
                      Leave Balance <i className={`bi ${getSortIcon('leaveBalance')} ms-1`}></i>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{ width: '40px', height: '40px' }}>
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-semibold">{employee.firstName} {employee.lastName}</div>
                            <small className="text-muted">ID: {employee.employeeId}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {employee.departmentName || 'No Department'}
                        </span>
                      </td>
                      <td>{employee.jobTitle || 'No Job Title'}</td>
                      <td>{formatDate(employee.hireDate)}</td>
                      <td>
                        <span className={`badge ${employee.leaveBalance > 10 ? 'bg-success' : 
                          employee.leaveBalance > 5 ? 'bg-warning' : 'bg-danger'}`}>
                          {employee.leaveBalance} days
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-info"
                            onClick={() => navigate(`/employees/profile/${employee.employeeId}`)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/employees/edit/${employee.employeeId}`)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => setDeleteModal({ show: true, employee })}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
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

      <ConfirmModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, employee: null })}
        onConfirm={handleDeleteEmployee}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteModal.employee?.firstName} ${deleteModal.employee?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default EmployeeList