import React from 'react'

const LoadingSpinner = ({ size = 'normal', text = 'Loading...' }) => {
  const sizeClass = size === 'small' ? 'spinner-border-sm' : ''
  
  return (
    <div className="loading-spinner">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <div className="mt-2 text-muted">{text}</div>}
    </div>
  )
}

export default LoadingSpinner