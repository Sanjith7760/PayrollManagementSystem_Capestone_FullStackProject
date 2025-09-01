import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { departmentService } from '../../services/departmentService'
import LoadingSpinner from '../common/LoadingSpinner'
import ConfirmModal from '../common/ConfirmModal'
import { getErrorMessage, filterBy } from '../../utils/helpers'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState({ show: false, department: null })

  const navigate = useNavigate()

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    const filtered = filterBy(departments, searchTerm, ['departmentName', 'description'])
    setFilteredDepartments(filtered)
  }, [departments, searchTerm])

  const loadDepartments = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await departmentService.getAllDepartments()
      setDepartments(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDepartment = async () => {
    try {
      await departmentService.deleteDepartment(deleteModal.department.departmentId)
      setDepartments(departments.filter(dept => dept.departmentId !== deleteModal.department.departmentId))
      setDeleteModal({ show: false, department: null })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading departments..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">Department Management</h1>
        <Link to="/departments/new" className="btn btn-primary">
          <i className="bi bi-building-add me-2"></i>
          Add Department
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
                <i className="bi bi-building me-2"></i>
                Departments ({filteredDepartments.length})
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
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredDepartments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-building fs-1 text-muted d-block mb-3"></i>
              <h5>No departments found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first department'}
              </p>
              {!searchTerm && (
                <Link to="/departments/new" className="btn btn-primary">
                  <i className="bi bi-building-add me-2"></i>
                  Add Department
                </Link>
              )}
            </div>
          ) : (
            <div className="row g-4 p-4">
              {filteredDepartments.map((department) => (
                <div key={department.departmentId} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-hover">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                          <i className="bi bi-building fs-4"></i>
                        </div>
                        <div className="dropdown">
                          <button className="btn btn-link p-0" data-bs-toggle="dropdown">
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => navigate(`/departments/edit/${department.departmentId}`)}
                              >
                                <i className="bi bi-pencil me-2"></i>Edit
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => setDeleteModal({ show: true, department })}
                              >
                                <i className="bi bi-trash me-2"></i>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <h5 className="card-title">{department.departmentName}</h5>
                      <p className="card-text text-muted">
                        {department.description || 'No description available'}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">ID: {department.departmentId}</small>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/departments/edit/${department.departmentId}`)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => setDeleteModal({ show: true, department })}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, department: null })}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        message={`Are you sure you want to delete the ${deleteModal.department?.departmentName} department? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default DepartmentList