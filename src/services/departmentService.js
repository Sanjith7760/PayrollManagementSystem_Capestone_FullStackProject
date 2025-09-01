import api from './api'

export const departmentService = {
  getAllDepartments: async () => {
    const response = await api.get('/departments')
    return response.data
  },

  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/${id}`)
    return response.data
  },

  createDepartment: async (departmentData) => {
    const response = await api.post('/departments', departmentData)
    return response.data
  },

  updateDepartment: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData)
    return response.data
  },

  deleteDepartment: async (id) => {
    await api.delete(`/departments/${id}`)
  }
}