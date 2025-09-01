import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role === ROLES.ADMIN

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      path: isAdmin ? '/dashboard' : '/employee-dashboard',
      show: true
    },
    {
      title: 'Employees',
      icon: 'bi-people',
      path: '/employees',
      show: isAdmin
    },
    {
      title: 'Departments',
      icon: 'bi-building',
      path: '/departments',
      show: isAdmin
    },
    {
      title: 'Job Roles',
      icon: 'bi-briefcase',
      path: '/jobroles',
      show: isAdmin
    },
    {
      title: 'Leave Management',
      icon: 'bi-calendar-check',
      path: '/leaves',
      show: true
    },
    {
      title: 'Leave Approval',
      icon: 'bi-check-circle',
      path: '/leaves/approval',
      show: isAdmin
    },
    {
      title: 'Payroll',
      icon: 'bi-cash-stack',
      path: '/payroll',
      show: true
    }
  ]

  const filteredMenuItems = menuItems.filter(item => item.show)

  return (
    <div className="sidebar">
      <div className="sidebar-header p-4 text-center border-bottom border-white border-opacity-25">
        <div className="sidebar-logo mb-3">
          <i className="bi bi-building-fill-check fs-1"></i>
        </div>
        <h5 className="mb-1">Payroll System</h5>
        <p className="mb-0 opacity-75 small">Management Portal</p>
      </div>

      <div className="sidebar-body p-0">
        <ul className="sidebar-nav">
          {filteredMenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
                end={item.path === '/dashboard' || item.path === '/employee-dashboard'}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer p-3 border-top border-white border-opacity-25">
        <div className="d-flex align-items-center">
          <div className="avatar bg-white bg-opacity-25 text-white rounded-circle d-flex align-items-center justify-content-center me-3"
               style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-person-fill"></i>
          </div>
          <div>
            <div className="fw-semibold">{user?.username}</div>
            <small className="opacity-75">{user?.role}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar