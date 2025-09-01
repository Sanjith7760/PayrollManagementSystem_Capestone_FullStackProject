import api from './api'

export const payrollService = {
  getAllPayrolls: async () => {
    const response = await api.get('/payroll')
    return response.data
  },

  getPayrollsByEmployee: async (employeeId) => {
    const response = await api.get(`/payroll/employee/${employeeId}`)
    return response.data
  },

  getPayrollsByPeriod: async (month, year) => {
    const response = await api.get('/payroll/period', {
      params: { month, year }
    })
    return response.data
  },

  getPayrollById: async (id) => {
    const response = await api.get(`/payroll/${id}`)
    return response.data
  },

  createPayroll: async (payrollData) => {
    const response = await api.post('/payroll', payrollData)
    return response.data
  },

  processPayroll: async (id) => {
    const response = await api.patch(`/payroll/${id}/process`)
    return response.data
  },

  deletePayroll: async (id) => {
    await api.delete(`/payroll/${id}`)
  }
}