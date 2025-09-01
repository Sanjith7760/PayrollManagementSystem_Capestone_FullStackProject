export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE'
}

export const LEAVE_TYPES = {
  SICK: 'SICK',
  CASUAL: 'CASUAL',
  PAID: 'PAID',
  UNPAID: 'UNPAID'
}

export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
}

export const PAYROLL_STATUS = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  PAID: 'PAID'
}

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

export const CURRENT_YEAR = new Date().getFullYear()

export const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i)