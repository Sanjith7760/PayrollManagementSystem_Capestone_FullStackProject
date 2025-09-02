// LeaveController.java
package com.payroll.controller;

import com.payroll.dto.LeaveRequestDto;
import com.payroll.model.LeaveRequest;
import com.payroll.service.LeaveService;
import com.payroll.service.SmartMessageService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveController {
    private final LeaveService leaveService;
    private final SmartMessageService smartMessageService;

    public LeaveController(LeaveService leaveService,SmartMessageService smartMessageService) {
        this.leaveService = leaveService;
        this.smartMessageService=smartMessageService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveService.getAllLeaveRequests());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnData(authentication, #employeeId)")
    public ResponseEntity<List<LeaveRequestDto>> getLeaveRequestsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeaveRequestsByEmployee(employeeId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<LeaveRequestDto>> getPendingLeaveRequests() {
        return ResponseEntity.ok(leaveService.getPendingLeaveRequests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnLeaveRequest(authentication, #id)")
    public ResponseEntity<LeaveRequestDto> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveRequestById(id));
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> createLeaveRequest(@Valid @RequestBody LeaveRequestDto leaveRequestDto) {
        return ResponseEntity.ok(leaveService.createLeaveRequest(leaveRequestDto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<LeaveRequestDto> updateLeaveRequestStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam Long processedBy) {
        return ResponseEntity.ok(leaveService.updateLeaveRequestStatus(id, status, processedBy));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnLeaveRequest(authentication, #id)")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable Long id) {
        leaveService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/ai-message")
    public ResponseEntity<String> getLeaveAIMessage(@PathVariable Long id) {
        try {
            // Get the leave request first
            LeaveRequestDto leaveDto = leaveService.getLeaveRequestById(id);
            
            // Create a simple LeaveRequest object for AI processing
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setLeaveId(leaveDto.getLeaveId());
            leaveRequest.setStartDate(leaveDto.getStartDate());
            leaveRequest.setEndDate(leaveDto.getEndDate());
            leaveRequest.setLeaveType(LeaveRequest.LeaveType.valueOf(leaveDto.getLeaveType()));
            leaveRequest.setStatus(LeaveRequest.LeaveStatus.valueOf(leaveDto.getStatus()));
            leaveRequest.setReason(leaveDto.getReason());
            
            // Generate AI message
            String aiMessage = smartMessageService.generateLeaveStatusMessage(leaveRequest);
            
            return ResponseEntity.ok(aiMessage);
        } catch (Exception e) {
            return ResponseEntity.ok("AI analysis unavailable at the moment.");
        }
    }
}