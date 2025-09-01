import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { departmentService } from '../../services/departmentService'
import LoadingSpinner from '../common/LoadingSpinner'
import { getErrorMessage } from '../../utils/helpers'

const DepartmentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    departmentName: '',
    description: ''
  })

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      loadDepartment()
    }
  }, [id])

  const loadDepartment = async () => {
    try {
      setLoading(true)
      const department = await departmentService.getDepartmentById(id)
      setFormData({
        departmentName: department.departmentName,
        description: department.description || ''
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
    if (!formData.departmentName.trim()) {
      setError('Department name is required')
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
        await departmentService.updateDepartment(id, formData)
      } else {
        await departmentService.createDepartment(formData)
      }

      navigate('/departments')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading department data..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">
          {isEdit ? 'Edit Department' : 'Add New Department'}
        </h1>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/departments')}
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
                <i className="bi bi-building me-2"></i>
                Department Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="departmentName" className="form-label">Department Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="departmentName"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    required
                    disabled={submitLoading}
                    placeholder="Enter department name"
                  />
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
                    placeholder="Enter department description (optional)"
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
                        {isEdit ? 'Update Department' : 'Create Department'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/departments')}
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
                  Department name is required and must be unique
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Description is optional but recommended
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Use clear, descriptive names for departments
                </li>
              </ul>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                Examples
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Department Names:</strong>
                <ul className="list-unstyled mt-2">
                  <li>• Information Technology</li>
                  <li>• Human Resources</li>
                  <li>• Finance & Accounting</li>
                  <li>• Marketing & Sales</li>
                  <li>• Operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentForm