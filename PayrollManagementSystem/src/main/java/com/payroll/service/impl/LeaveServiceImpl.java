// LeaveServiceImpl.java
package com.payroll.service.impl;

import com.payroll.dto.LeaveRequestDto;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.model.Employee;
import com.payroll.model.LeaveRequest;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.LeaveRequestRepository;
import com.payroll.service.LeaveService;
import com.payroll.service.SmartMessageService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveServiceImpl implements LeaveService {
	
	private final SmartMessageService smartMessageService;
    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveServiceImpl(LeaveRequestRepository leaveRequestRepository, EmployeeRepository employeeRepository, SmartMessageService smartMessageService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.smartMessageService = smartMessageService;
    }

    @Override
    public List<LeaveRequestDto> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestDto> getLeaveRequestsByEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        return leaveRequestRepository.findByEmployee(employee).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestDto> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatus(LeaveRequest.LeaveStatus.PENDING).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LeaveRequestDto getLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        return convertToDto(leaveRequest);
    }

    @Override
    @Transactional
    public LeaveRequestDto createLeaveRequest(LeaveRequestDto leaveRequestDto) {
        Employee employee = employeeRepository.findById(leaveRequestDto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + leaveRequestDto.getEmployeeId()));
        
        // Check if employee has sufficient leave balance
        if (employee.getLeaveBalance() <= 0) {
            throw new RuntimeException("Insufficient leave balance");
        }
        
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setStartDate(leaveRequestDto.getStartDate());
        leaveRequest.setEndDate(leaveRequestDto.getEndDate());
        leaveRequest.setLeaveType(LeaveRequest.LeaveType.valueOf(leaveRequestDto.getLeaveType()));
        leaveRequest.setReason(leaveRequestDto.getReason());
        
        LeaveRequest savedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return convertToDto(savedLeaveRequest);
    }

    @Override
    @Transactional
    public LeaveRequestDto updateLeaveRequestStatus(Long id, String status, Long processedBy) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        
        Employee processor = employeeRepository.findById(processedBy)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + processedBy));
        
        LeaveRequest.LeaveStatus newStatus = LeaveRequest.LeaveStatus.valueOf(status);
        leaveRequest.setStatus(newStatus);
        leaveRequest.setProcessedBy(processor);
        leaveRequest.setProcessedDate(LocalDateTime.now());
        
        // If approved, deduct leave balance
        if (newStatus == LeaveRequest.LeaveStatus.APPROVED) {
            Employee employee = leaveRequest.getEmployee();
            long daysRequested = java.time.temporal.ChronoUnit.DAYS.between(
                leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
            
            if (employee.getLeaveBalance() < daysRequested) {
                throw new RuntimeException("Insufficient leave balance for approval");
            }
            
            employee.setLeaveBalance(employee.getLeaveBalance() - (int) daysRequested);
            employeeRepository.save(employee);
        }
        
        LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return convertToDto(updatedLeaveRequest);
    }

    @Override
    public void deleteLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        leaveRequestRepository.delete(leaveRequest);
    }

    private LeaveRequestDto convertToDto(LeaveRequest leaveRequest) {
        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setLeaveId(leaveRequest.getLeaveId());
        dto.setEmployeeId(leaveRequest.getEmployee().getEmployeeId());
        dto.setEmployeeName(
                leaveRequest.getEmployee().getFirstName() + " " + 
                leaveRequest.getEmployee().getLastName()
            );
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setLeaveType(leaveRequest.getLeaveType().name());
        dto.setReason(leaveRequest.getReason());
        dto.setStatus(leaveRequest.getStatus().name());
        dto.setAppliedDate(leaveRequest.getAppliedDate());
        dto.setProcessedDate(leaveRequest.getProcessedDate());
        
        // 🤖 ADD AI MESSAGE HERE
        dto.setAiMessage(smartMessageService.generateLeaveStatusMessage(leaveRequest));
        
        if (leaveRequest.getProcessedBy() != null) {
            dto.setProcessedBy(leaveRequest.getProcessedBy().getEmployeeId());
        }
        
        return dto;
    }
}