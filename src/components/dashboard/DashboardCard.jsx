import React from 'react'

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  subtitle = '',
  trend = null,
  onClick = null
}) => {
  const cardClass = `dashboard-card ${color} ${onClick ? 'cursor-pointer' : ''}`
  
  return (
    <div className={cardClass} onClick={onClick}>
      <div className="row align-items-center">
        <div className="col">
          <div className={`text-${color} fw-bold fs-6`}>{title}</div>
          <div className="fs-2 fw-bold text-dark">{value}</div>
          {subtitle && (
            <div className="text-muted small">{subtitle}</div>
          )}
          {trend && (
            <div className={`small ${trend.positive ? 'text-success' : 'text-danger'}`}>
              <i className={`bi bi-arrow-${trend.positive ? 'up' : 'down'} me-1`}></i>
              {trend.value}% from last month
            </div>
          )}
        </div>
        <div className="col-auto">
          <i className={`bi ${icon} icon text-${color}`}></i>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard