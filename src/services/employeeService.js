import api from './api'

export const employeeService = {
  getAllEmployees: async () => {
    const response = await api.get('/employees')
    return response.data
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`)
    return response.data
  },

  getEmployeeByUserId: async (userId) => {
    const response = await api.get(`/employees/user/${userId}`)
    return response.data
  },

  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData)
    return response.data
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData)
    return response.data
  },

  deleteEmployee: async (id) => {
    await api.delete(`/employees/${id}`)
  },

  // Admin endpoints
  adminGetAllEmployees: async () => {
    const response = await api.get('/admin/employees')
    return response.data
  },

  adminCreateEmployee: async (employeeData) => {
    const response = await api.post('/admin/employees', employeeData)
    return response.data
  },

  adminUpdateEmployee: async (id, employeeData) => {
    const response = await api.put(`/admin/employees/${id}`, employeeData)
    return response.data
  },

  adminDeleteEmployee: async (id) => {
    await api.delete(`/admin/employees/${id}`)
  }
}