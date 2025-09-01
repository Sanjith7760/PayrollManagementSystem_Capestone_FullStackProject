import api from './api'

export const jobRoleService = {
  getAllJobRoles: async () => {
    const response = await api.get('/jobs')
    return response.data
  },

  getJobRoleById: async (id) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  },

  createJobRole: async (jobRoleData) => {
    const response = await api.post('/jobs', jobRoleData)
    return response.data
  },

  updateJobRole: async (id, jobRoleData) => {
    const response = await api.put(`/jobs/${id}`, jobRoleData)
    return response.data
  },

  deleteJobRole: async (id) => {
    await api.delete(`/jobs/${id}`)
  }
}