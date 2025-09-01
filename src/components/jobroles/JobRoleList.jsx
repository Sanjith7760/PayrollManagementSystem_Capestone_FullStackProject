import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobRoleService } from '../../services/jobRoleService'
import LoadingSpinner from '../common/LoadingSpinner'
import ConfirmModal from '../common/ConfirmModal'
import { getErrorMessage, filterBy, formatCurrency } from '../../utils/helpers'

const JobRoleList = () => {
  const [jobRoles, setJobRoles] = useState([])
  const [filteredJobRoles, setFilteredJobRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState({ show: false, jobRole: null })

  const navigate = useNavigate()

  useEffect(() => {
    loadJobRoles()
  }, [])

  useEffect(() => {
    const filtered = filterBy(jobRoles, searchTerm, ['jobTitle', 'description'])
    setFilteredJobRoles(filtered)
  }, [jobRoles, searchTerm])

  const loadJobRoles = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await jobRoleService.getAllJobRoles()
      setJobRoles(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJobRole = async () => {
    try {
      await jobRoleService.deleteJobRole(deleteModal.jobRole.jobId)
      setJobRoles(jobRoles.filter(job => job.jobId !== deleteModal.jobRole.jobId))
      setDeleteModal({ show: false, jobRole: null })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading job roles..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">Job Role Management</h1>
        <Link to="/jobroles/new" className="btn btn-primary">
          <i className="bi bi-briefcase-fill me-2"></i>
          Add Job Role
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
                <i className="bi bi-briefcase me-2"></i>
                Job Roles ({filteredJobRoles.length})
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
                  placeholder="Search job roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredJobRoles.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-briefcase fs-1 text-muted d-block mb-3"></i>
              <h5>No job roles found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first job role'}
              </p>
              {!searchTerm && (
                <Link to="/jobroles/new" className="btn btn-primary">
                  <i className="bi bi-briefcase-fill me-2"></i>
                  Add Job Role
                </Link>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Base Salary</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobRoles.map((jobRole) => (
                    <tr key={jobRole.jobId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                            <i className="bi bi-briefcase-fill"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{jobRole.jobTitle}</div>
                            <small className="text-muted">ID: {jobRole.jobId}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          {formatCurrency(jobRole.baseSalary)}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {jobRole.description || 'No description'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/jobroles/edit/${jobRole.jobId}`)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => setDeleteModal({ show: true, jobRole })}
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
        onHide={() => setDeleteModal({ show: false, jobRole: null })}
        onConfirm={handleDeleteJobRole}
        title="Delete Job Role"
        message={`Are you sure you want to delete the ${deleteModal.jobRole?.jobTitle} job role? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default JobRoleList