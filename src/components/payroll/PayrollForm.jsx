import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { payrollService } from '../../services/payrollService'
import { employeeService } from '../../services/employeeService'
import LoadingSpinner from '../common/LoadingSpinner'
import { getErrorMessage, formatCurrency } from '../../utils/helpers'
import { MONTHS, CURRENT_YEAR } from '../../utils/constants'

const PayrollForm = () => {
  const navigate = useNavigate()

  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: CURRENT_YEAR,
    baseSalary: '',
    allowances: '0',
    deductions: '0'
  })

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [netSalary, setNetSalary] = useState(0)

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    calculateNetSalary()
  }, [formData.baseSalary, formData.allowances, formData.deductions])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getAllEmployees()
      setEmployees(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.baseSalary) || 0
    const allowances = parseFloat(formData.allowances) || 0
    const deductions = parseFloat(formData.deductions) || 0
    setNetSalary(basic + allowances - deductions)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEmployeeChange = (e) => {
    const selectedEmployee = employees.find(emp => emp.employeeId === parseInt(e.target.value))
    setFormData({
      ...formData,
      employeeId: e.target.value,
      baseSalary: selectedEmployee?.jobRole?.baseSalary || ''
    })
  }

  const validateForm = () => {
    if (!formData.employeeId) {
      setError('Please select an employee')
      return false
    }
    if (!formData.baseSalary || formData.baseSalary <= 0) {
      setError('Base salary must be greater than 0')
      return false
    }
    if (formData.allowances < 0 || formData.deductions < 0) {
      setError('Allowances and deductions cannot be negative')
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
      
      const submitData = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        baseSalary: parseFloat(formData.baseSalary),
        allowances: parseFloat(formData.allowances),
        deductions: parseFloat(formData.deductions)
      }

      await payrollService.createPayroll(submitData)
      navigate('/payroll')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading employees..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">Generate Payroll</h1>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/payroll')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Payroll
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
                <i className="bi bi-cash-stack me-2"></i>
                Payroll Details
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label htmlFor="employeeId" className="form-label">Employee *</label>
                    <select
                      className="form-select"
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleEmployeeChange}
                      required
                      disabled={submitLoading}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.employeeId} value={employee.employeeId}>
                          {employee.firstName} {employee.lastName} - {employee.jobTitle || 'No Title'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="month" className="form-label">Month *</label>
                    <select
                      className="form-select"
                      id="month"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      required
                      disabled={submitLoading}
                    >
                      {MONTHS.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="year" className="form-label">Year *</label>
                    <input
                      type="number"
                      className="form-control"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      disabled={submitLoading}
                      min="2020"
                      max="2030"
                    />
                  </div>

                  <div className="col-md-4">
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

                  <div className="col-md-4">
                    <label htmlFor="allowances" className="form-label">Allowances</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        id="allowances"
                        name="allowances"
                        value={formData.allowances}
                        onChange={handleChange}
                        disabled={submitLoading}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="deductions" className="form-label">Deductions</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        id="deductions"
                        name="deductions"
                        value={formData.deductions}
                        onChange={handleChange}
                        disabled={submitLoading}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus me-2"></i>
                          Generate Payroll
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/payroll')}
                      disabled={submitLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="bi bi-calculator me-2"></i>
                Salary Calculation
              </h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span>Base Salary:</span>
                  <span className="fw-bold">{formatCurrency(formData.baseSalary || 0)}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span>Allowances:</span>
                  <span className="fw-bold text-success">+{formatCurrency(formData.allowances || 0)}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span>Deductions:</span>
                  <span className="fw-bold text-danger">-{formatCurrency(formData.deductions || 0)}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0 border-top">
                  <span className="fw-bold">Net Salary:</span>
                  <span className="fw-bold fs-5 text-success">{formatCurrency(netSalary)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollForm