// Date formatting utilities
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Currency formatting
export const formatCurrency = (amount) => {
  if (!amount) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

// Status badge styling
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    PENDING: 'badge bg-warning text-dark status-pending',
    APPROVED: 'badge bg-success status-approved',
    REJECTED: 'badge bg-danger status-rejected',
    PROCESSED: 'badge bg-info status-processed',
    PAID: 'badge bg-success'
  }
  return statusClasses[status] || 'badge bg-secondary'
}

// Form validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Error handling
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data) {
    const errors = Object.values(error.response.data)
    return errors.join(', ')
  }
  return error.message || 'An error occurred'
}

// Local storage utilities
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const getStoredToken = () => {
  return localStorage.getItem('token')
}

// Array utilities
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

export const filterBy = (array, searchTerm, keys) => {
  if (!searchTerm) return array
  
  return array.filter(item => 
    keys.some(key => 
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
}

// Leave calculation
export const calculateLeaveDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays + 1 // Include both start and end date
}

// Month names
export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthNumber - 1] || ''
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}