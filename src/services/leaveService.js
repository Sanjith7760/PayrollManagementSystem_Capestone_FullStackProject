import api from './api'

export const leaveService = {
  getAllLeaveRequests: async () => {
    const response = await api.get('/leaves')
    return response.data
  },

  getLeaveRequestsByEmployee: async (employeeId) => {
    const response = await api.get(`/leaves/employee/${employeeId}`)
    return response.data
  },

  getPendingLeaveRequests: async () => {
    const response = await api.get('/leaves/pending')
    return response.data
  },

  getLeaveRequestById: async (id) => {
    const response = await api.get(`/leaves/${id}`)
    return response.data
  },

  createLeaveRequest: async (leaveData) => {
    const response = await api.post('/leaves', leaveData)
    return response.data
  },

  updateLeaveRequestStatus: async (id, status, processedBy) => {
    const response = await api.patch(`/leaves/${id}/status`, null, {
      params: { status, processedBy }
    })
    return response.data
  },

  deleteLeaveRequest: async (id) => {
    await api.delete(`/leaves/${id}`)
  }
}