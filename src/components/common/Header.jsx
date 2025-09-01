import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar')
    const mainContent = document.querySelector('.main-content')
    
    sidebar.classList.toggle('collapsed')
    mainContent.classList.toggle('expanded')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <div className="d-flex align-items-center">
        <button 
          className="btn btn-link p-0 me-3 d-md-none" 
          onClick={toggleSidebar}
          style={{ border: 'none' }}
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        <h4 className="mb-0 text-gradient">Dashboard</h4>
      </div>

      <div className="ms-auto d-flex align-items-center">
        <div className="dropdown">
          <button
            className="btn btn-link dropdown-toggle d-flex align-items-center"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ textDecoration: 'none', border: 'none' }}
          >
            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                 style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person-fill"></i>
            </div>
            <div className="text-start d-none d-sm-block">
              <div className="fw-semibold text-dark">{user?.username}</div>
              <small className="text-muted">{user?.role}</small>
            </div>
          </button>

          {showDropdown && (
            <div className="dropdown-menu dropdown-menu-end show">
              <div className="dropdown-header">
                <strong>{user?.username}</strong>
                <br />
                <small className="text-muted">{user?.email}</small>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setShowDropdown(false)
                  navigate('/employees/profile/' + user?.id)
                }}
              >
                <i className="bi bi-person me-2"></i>
                Profile
              </button>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setShowDropdown(false)
                  // Navigate to settings when implemented
                }}
              >
                <i className="bi bi-gear me-2"></i>
                Settings
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item text-danger" 
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header