import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobRoleService } from '../../services/jobRoleService'
import LoadingSpinner from '../common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

const JobRoleForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    jobTitle: '',
    baseSalary: '',
    description: ''
  })

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      loadJobRole()
    }
  }, [id])

  const loadJobRole = async () => {
    try {
      setLoading(true)
      const jobRole = await jobRoleService.getJobRoleById(id)
      setFormData({
        jobTitle: jobRole.jobTitle,
        baseSalary: jobRole.baseSalary,
        description: jobRole.description || ''
      })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.jobTitle.trim()) {
      setError('Job title is required')
      return false
    }
    if (!formData.baseSalary || formData.baseSalary <= 0) {
      setError('Base salary must be greater than 0')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    try {
      setSubmitLoading(true)
      
      if (isEdit) {
        await jobRoleService.updateJobRole(id, formData)
      } else {
        await jobRoleService.createJobRole(formData)
      }

      navigate('/jobroles')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading job role data..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">
          {isEdit ? 'Edit Job Role' : 'Add New Job Role'}
        </h1>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/jobroles')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-briefcase me-2"></i>
                Job Role Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="jobTitle" className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    disabled={submitLoading}
                    placeholder="Enter job title"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="baseSalary" className="form-label">Base Salary *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      id="baseSalary"
                      name="baseSalary"
                      value={formData.baseSalary}
                      onChange={handleChange}
                      required
                      disabled={submitLoading}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={submitLoading}
                    placeholder="Enter job description (optional)"
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <i className={`bi ${isEdit ? 'bi-check' : 'bi-plus'} me-2`}></i>
                        {isEdit ? 'Update Job Role' : 'Create Job Role'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/jobroles')}
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Instructions
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Job title is required and must be unique
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Base salary should be the standard salary for this role
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Description helps employees understand the role
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobRoleForm