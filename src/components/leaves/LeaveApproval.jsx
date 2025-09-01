import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { leaveService } from '../../services/leaveService'
import { employeeService } from '../../services/employeeService'
import LoadingSpinner from '../common/LoadingSpinner'
import ConfirmModal from '../common/ConfirmModal'
import { formatDate, getStatusBadgeClass, getErrorMessage } from '../../utils/helpers'

const LeaveApproval = () => {
  const { user } = useAuth()
  const [pendingLeaves, setPendingLeaves] = useState([])
  const [adminEmployee, setAdminEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionModal, setActionModal] = useState({ show: false, leave: null, action: null })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [pendingData, employeeData] = await Promise.all([
        leaveService.getPendingLeaveRequests(),
        employeeService.getEmployeeByUserId(user.id)
      ])
      
      setPendingLeaves(pendingData)
      setAdminEmployee(employeeData)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveAction = async () => {
    try {
      const { leave, action } = actionModal
      await leaveService.updateLeaveRequestStatus(
        leave.leaveId, 
        action, 
        adminEmployee.employeeId
      )
      
      setPendingLeaves(pendingLeaves.filter(l => l.leaveId !== leave.leaveId))
      setActionModal({ show: false, leave: null, action: null })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading pending leave requests..." />
  }

  return (
    <div className="page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gradient">Leave Approval</h1>
        <div className="badge bg-warning fs-6">
          {pendingLeaves.length} Pending Requests
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-clock-history me-2"></i>
            Pending Leave Requests
          </h5>
        </div>
        <div className="card-body p-0">
          {pendingLeaves.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-check-circle fs-1 text-success d-block mb-3"></i>
              <h5>No pending requests</h5>
              <p className="text-muted">All leave requests have been processed!</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {pendingLeaves.map((leave) => (
                <div key={leave.leaveId} className="list-group-item">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3">
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">Employee #{leave.employeeId}</h6>
                          <small className="text-muted">Applied {formatDate(leave.appliedDate)}</small>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="badge bg-light text-dark me-2">{leave.leaveType}</span>
                        <span className="badge bg-info">
                          {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                        </span>
                      </div>
                      <div className="text-muted small mb-2">
                        <strong>Period:</strong> {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
                      </div>
                      <div className="text-muted small">
                        <strong>Reason:</strong> {leave.reason}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <span className={getStatusBadgeClass(leave.status)}>
                        {leave.status}
                      </span>
                    </div>
                    <div className="col-md-3 text-end">
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-success"
                          onClick={() => setActionModal({ 
                            show: true, 
                            leave, 
                            action: 'APPROVED' 
                          })}
                        >
                          <i className="bi bi-check-lg me-1"></i>
                          Approve
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => setActionModal({ 
                            show: true, 
                            leave, 
                            action: 'REJECTED' 
                          })}
                        >
                          <i className="bi bi-x-lg me-1"></i>
                          Reject
                        </button>
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
        show={actionModal.show}
        onHide={() => setActionModal({ show: false, leave: null, action: null })}
        onConfirm={handleLeaveAction}
        title={`${actionModal.action === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request`}
        message={`Are you sure you want to ${actionModal.action?.toLowerCase()} this leave request for Employee #${actionModal.leave?.employeeId}?`}
        confirmText={actionModal.action === 'APPROVED' ? 'Approve' : 'Reject'}
        variant={actionModal.action === 'APPROVED' ? 'success' : 'danger'}
      />
    </div>
  )
}

export default LeaveApproval