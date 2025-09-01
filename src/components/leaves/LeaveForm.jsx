  import React, { useState, useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { useAuth } from '../../context/AuthContext'
  import { leaveService } from '../../services/leaveService'
  import { employeeService } from '../../services/employeeService'
  import LoadingSpinner from '../common/LoadingSpinner'
  import { getErrorMessage, calculateLeaveDays } from '../../utils/helpers'
  import { LEAVE_TYPES } from '../../utils/constants'
  import { ROLES } from '../../utils/constants'
  const LeaveForm = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [employees, setEmployees] = useState([]);

    const [employee, setEmployee] = useState(null)
    const [formData, setFormData] = useState({
      employeeId: '', 
      startDate: '',
      endDate: '',
      leaveType: 'CASUAL',
      reason: ''
    })

    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [error, setError] = useState('')
    const [leaveDays, setLeaveDays] = useState(0)

 useEffect(() => {
    if (user?.id) {
        // FOR ADMIN USERS: Skip employee data loading entirely
        if (user?.role === ROLES.ADMIN) {
            setLoading(false); // ✅ Stop loading immediately
            setEmployee({}); // ✅ Set empty employee object
            return;
        }
        
        // FOR EMPLOYEE USERS: Load their employee data
        const loadData = async () => {
            try {
                setLoading(true);
                const employeeData = await employeeService.getEmployeeByUserId(user.id);
                setEmployee(employeeData);
            } catch (err) {
                console.error('Failed to load employee data:', err);
                setError(getErrorMessage(err));
            } finally {
                setLoading(false); // ✅ Always stop loading
            }
        };
        
        loadData();
    }
}, [user]);

    // This should be a SEPARATE useEffect for loading employees list
useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
        employeeService.getAllEmployees()
            .then(data => {
                console.log('Employees loaded for dropdown:', data);
                setEmployees(data);
            })
            .catch(err => {
                console.error('Failed to fetch employees list:', err);
            });
    }
}, [user]);

    useEffect(() => {
      if (formData.startDate && formData.endDate) {
        const days = calculateLeaveDays(formData.startDate, formData.endDate)
        setLeaveDays(days)
      } else {
        setLeaveDays(0)
      }
    }, [formData.startDate, formData.endDate])

    const loadEmployeeData = async () => {
    try {
        setLoading(true);
        const employeeData = await employeeService.getEmployeeByUserId(user.id);
        setEmployee(employeeData);
    } catch (err) {
        console.error('Failed to load employee data:', err);
        setError(getErrorMessage(err));
        setEmployee(null); // ✅ Ensure employee is set to null on error
    } finally {
        setLoading(false); // ✅ Always set loading to false
    }
};
    const handleChange = (e) => {
       console.log('Changing:', e.target.name, 'to:', e.target.value); 
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }

    const validateForm = () => {
    // For admins: validate employee selection
    if (user?.role === ROLES.ADMIN && !formData.employeeId) {
        setError('Please select an employee');
        return false;
    }
     if (user?.role !== ROLES.ADMIN && leaveDays > employee?.leaveBalance) {
        setError(`Insufficient leave balance. You have ${employee.leaveBalance} days available.`);
        return false;
    }
    if (!formData.startDate) {
          setError('Start date is required')
         return false
         }
      if (!formData.endDate) {
        setError('End date is required')
        return false
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('End date must be after start date')
        return false
      }
      if (!formData.reason.trim()) {
        setError('Reason is required')
        return false
      }
      if (leaveDays > employee?.leaveBalance) {
        setError(`Insufficient leave balance. You have ${employee.leaveBalance} days available.`)
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
      // For employees: use their own ID, for admins: use selected ID
      employeeId: user?.role === ROLES.ADMIN ? formData.employeeId : employee.employeeId
    }

    await leaveService.createLeaveRequest(submitData)
    navigate('/leaves')
  } catch (err) {
    setError(getErrorMessage(err))
  } finally {
    setSubmitLoading(false)
  }
}

    if (loading) {
    return <LoadingSpinner text="Loading form data..." />;
}

// Only show warning for employees who don't have employee data
if (!employee && user?.role !== ROLES.ADMIN) {
    return (
        <div className="alert alert-warning" role="alert">
            Employee profile not found. Please contact your administrator.
        </div>
    );
}

    return (
      <div className="page-transition">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 text-gradient">Apply for Leave</h1>
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/leaves')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Leaves
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
                  <i className="bi bi-calendar-plus me-2"></i>
                  Leave Request Details
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {user?.role === ROLES.ADMIN && (
  <div className="col-12">
    <label htmlFor="employeeId" className="form-label">Select Employee *</label>
    <select
      className="form-select"
      id="employeeId"
      name="employeeId"
      value={formData.employeeId}
      onChange={handleChange}
      required
      disabled={submitLoading}
    >
      <option value="">Select an employee</option>
      {console.log('Employees array:', employees)} {/* ✅ Debug log */}
      {employees.length > 0 ? (
        employees.map(emp => (
          <option key={emp.employeeId} value={emp.employeeId}>
            {emp.firstName} {emp.lastName} (ID: {emp.employeeId})
          </option>
        ))
      ) : (
        <option value="" disabled>Loading employees...</option>
      )}
    </select>
  </div>
)}

                    <div className="col-md-6">
                      <label htmlFor="leaveType" className="form-label">Leave Type *</label>
                      <select
                        className="form-select"
                        id="leaveType"
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        required
                        disabled={submitLoading}
                      >
                        {Object.values(LEAVE_TYPES).map((type) => (
                          <option key={type} value={type}>
                            {type.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Days Requested</label>
                      <div className="form-control bg-light">
                        {leaveDays} {leaveDays === 1 ? 'day' : 'days'}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="startDate" className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        disabled={submitLoading}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="endDate" className="form-label">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        disabled={submitLoading}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="reason" className="form-label">Reason *</label>
                      <textarea
                        className="form-control"
                        id="reason"
                        name="reason"
                        rows="4"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        disabled={submitLoading}
                        placeholder="Please provide a detailed reason for your leave request..."
                      ></textarea>
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
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Submit Leave Request
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/leaves')}
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
      <i className="bi bi-info-circle me-2"></i>
      {user?.role === ROLES.ADMIN ? 'Employee Leave Balance' : 'Your Leave Balance'}
    </h6>
  </div>
  <div className="card-body text-center">
    <div className="display-4 fw-bold text-success mb-2">
      {user?.role === ROLES.ADMIN ? '∞' : employee.leaveBalance}
    </div>
    <p className="text-muted mb-3">Days Available</p>
    
    {leaveDays > 0 && user?.role !== ROLES.ADMIN && (
      <div className="alert alert-info">
        <small>
          After this request: <strong>{employee.leaveBalance - leaveDays}</strong> days remaining
        </small>
      </div>
    )}
    
    {user?.role === ROLES.ADMIN && (
      <div className="alert alert-info">
        <small>Select an employee to view their leave balance</small>
      </div>
    )}
         </div>
      </div>

            <div className="card mt-3">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <i className="bi bi-lightbulb me-2"></i>
                  Leave Policy
                </h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Apply at least 3 days in advance
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Casual leaves: Up to 3 consecutive days
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Sick leaves: Medical certificate required for 3+ days
                  </li>
                  <li className="mb-0">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Emergency leaves will be considered
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default LeaveForm