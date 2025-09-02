import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage, validateEmail } from '../../utils/helpers'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/employee-dashboard" replace />
  }

  const validateUsername = (username) => {
    if (username.length < 3) {
      return 'Username must be at least 3 characters long'
    }
    if (!/^[A-Z]/.test(username)) {
      return 'First letter must be capital'
    }
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return ''
  }

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)'
    }
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      })
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ''

    switch (name) {
      case 'username':
        error = validateUsername(value)
        break
      case 'email':
        error = validateEmail(value) ? '' : 'Please enter a valid email address'
        break
      case 'password':
        error = validatePassword(value)
        break
      case 'confirmPassword':
        error = value !== formData.password ? 'Passwords do not match' : ''
        break
      default:
        break
    }

    setFieldErrors({
      ...fieldErrors,
      [name]: error
    })
  }

  const validateForm = () => {
    const errors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email) ? '' : 'Please enter a valid email address',
      password: validatePassword(formData.password),
      confirmPassword: formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''
    }

    setFieldErrors(errors)

    // Check if any errors exist
    return Object.values(errors).every(error => error === '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-building-fill-check"></i>
          <h3 className="mt-3 mb-0">Payroll System</h3>
          <p className="text-muted">Create your account</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username *</label>
            <input
              type="text"
              className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              placeholder="First letter must be capital (e.g., John123)"
            />
            {fieldErrors.username && (
              <div className="invalid-feedback">{fieldErrors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={loading}
              placeholder="example@company.com"
            />
            {fieldErrors.email && (
              <div className="invalid-feedback">{fieldErrors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password *</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={loading}
                placeholder="At least 8 characters with uppercase, lowercase, number, and special character"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              {fieldErrors.password && (
                <div className="invalid-feedback">{fieldErrors.password}</div>
              )}
            </div>
            
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={loading}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
              >
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              {fieldErrors.confirmPassword && (
                <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className="mb-0">Already have an account? 
              <Link to="/login" className="text-decoration-none ms-1">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register