// LeaveRequestDto.java
package com.payroll.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveRequestDto {
    private Long leaveId;
    
    @NotNull
    private Long employeeId;
    
    @NotNull
    private LocalDate startDate;
    
    @NotNull
    private LocalDate endDate;
    
    private String employeeName; 

    private String aiMessage;
    
    private String leaveType;
    private String reason;
    private String status;
    private LocalDateTime appliedDate;
    private LocalDateTime processedDate;
    private Long processedBy;
   
    
	public Long getLeaveId() {
		return leaveId;
	}
	public void setLeaveId(Long leaveId) {
		this.leaveId = leaveId;
	}
	public Long getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}
	public LocalDate getStartDate() {
		return startDate;
	}
	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}
	public LocalDate getEndDate() {
		return endDate;
	}
	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}
	public String getLeaveType() {
		return leaveType;
	}
	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public LocalDateTime getAppliedDate() {
		return appliedDate;
	}
	public void setAppliedDate(LocalDateTime appliedDate) {
		this.appliedDate = appliedDate;
	}
	public LocalDateTime getProcessedDate() {
		return processedDate;
	}
	public void setProcessedDate(LocalDateTime processedDate) {
		this.processedDate = processedDate;
	}
	public Long getProcessedBy() {
		return processedBy;
	}
	public void setProcessedBy(Long processedBy) {
		this.processedBy = processedBy;
	}
    
    // Getters and setters
	public String getAiMessage() {
	    return aiMessage;
	}

	public void setAiMessage(String aiMessage) {
	    this.aiMessage = aiMessage;
	}
	public String getEmployeeName() {
		return employeeName;
	}
	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	
	
    
}