import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { payrollService } from '../../services/payrollService'
import { employeeService } from '../../services/employeeService'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatDate, formatCurrency, getStatusBadgeClass, getErrorMessage, getMonthName } from '../../utils/helpers'

const PayrollDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [payroll, setPayroll] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPayrollDetails()
  }, [id])

  const loadPayrollDetails = async () => {
    try {
      setLoading(true)
      const payrollData = await payrollService.getPayrollById(id)
      const employeeData = await employeeService.getEmployeeById(payrollData.employeeId)
      
      setPayroll(payrollData)
      setEmployee(employeeData)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <LoadingSpinner text="Loading payroll details..." />
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-link p-0 ms-2" onClick={loadPayrollDetails}>
          Try again
        </button>
      </div>
    )
  }

  if (!payroll || !employee) {
    return (
      <div className="text-center py-5">
        <h5>Payroll record not found</h5>
        <button className="btn btn-primary" onClick={() => navigate('/payroll')}>
          Back to Payroll
        </button>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <h1 className="h3 mb-0 text-gradient">Payroll Details</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print Payslip
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/payroll')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Payroll
          </button>
        </div>
      </div>

      <div className="card payslip">
        <div className="card-header bg-primary text-white">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="mb-0">
                <i className="bi bi-building-fill-check me-2"></i>
                Payroll Management System
              </h4>
              <p className="mb-0 opacity-75">Salary Slip</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h5 className="mb-0">{getMonthName(payroll.month)} {payroll.year}</h5>
              <p className="mb-0 opacity-75">Generated: {formatDate(payroll.generatedDate)}</p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="text-primary mb-3">Employee Information</h5>
              <table className="table table-borderless">
                <tr>
                  <td className="fw-semibold">Employee ID:</td>
                  <td>{employee.employeeId}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Name:</td>
                  <td>{employee.firstName} {employee.lastName}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Department:</td>
                  <td>{employee.departmentName || 'Not assigned'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Position:</td>
                  <td>{employee.jobTitle || 'Not assigned'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Join Date:</td>
                  <td>{formatDate(employee.hireDate)}</td>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <h5 className="text-primary mb-3">Payroll Information</h5>
              <table className="table table-borderless">
                <tr>
                  <td className="fw-semibold">Payroll ID:</td>
                  <td>{payroll.payrollId}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Pay Period:</td>
                  <td>{getMonthName(payroll.month)} {payroll.year}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Status:</td>
                  <td>
                    <span className={getStatusBadgeClass(payroll.status)}>
                      {payroll.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">Generated Date:</td>
                  <td>{formatDate(payroll.generatedDate)}</td>
                </tr>
                {payroll.processedDate && (
                  <tr>
                    <td className="fw-semibold">Processed Date:</td>
                    <td>{formatDate(payroll.processedDate)}</td>
                  </tr>
                )}
              </table>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h5 className="text-primary mb-3">Salary Breakdown</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">Basic Salary</td>
                      <td className="text-end fw-semibold">{formatCurrency(payroll.baseSalary)}</td>
                    </tr>
                    <tr>
                      <td>Allowances</td>
                      <td className="text-end text-success">+{formatCurrency(payroll.allowances)}</td>
                    </tr>
                    <tr>
                      <td>Deductions</td>
                      <td className="text-end text-danger">-{formatCurrency(payroll.deductions)}</td>
                    </tr>
                    <tr className="table-primary">
                      <td className="fw-bold fs-5">NET SALARY</td>
                      <td className="text-end fw-bold fs-5 text-success">
                        {formatCurrency(payroll.netSalary)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="border-top pt-3">
                <p className="text-muted small mb-0">
                  <strong>Note:</strong> This is a computer-generated payslip. 
                  No signature is required. For any queries, please contact the HR department.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-light text-center">
          <small className="text-muted">
            © 2024 Payroll Management System. All rights reserved.
          </small>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .card { border: none !important; box-shadow: none !important; }
          .payslip { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  )
}

export default PayrollDetails