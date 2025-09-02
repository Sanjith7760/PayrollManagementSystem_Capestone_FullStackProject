package com.payroll.service;

import com.payroll.dto.LeaveRequestDto;
import java.util.List;

public interface LeaveService {
    List<LeaveRequestDto> getAllLeaveRequests();
    List<LeaveRequestDto> getLeaveRequestsByEmployee(Long employeeId);
    List<LeaveRequestDto> getPendingLeaveRequests();
    LeaveRequestDto getLeaveRequestById(Long id);
    LeaveRequestDto createLeaveRequest(LeaveRequestDto leaveRequestDto);
    LeaveRequestDto updateLeaveRequestStatus(Long id, String status, Long processedBy);
    void deleteLeaveRequest(Long id);
}