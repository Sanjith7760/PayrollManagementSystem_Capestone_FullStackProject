package com.payroll.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.payroll.dto.LeaveRequestDto;
import com.payroll.model.Employee;
import com.payroll.model.LeaveRequest;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.LeaveRequestRepository;
import com.payroll.service.SmartMessageService;
import com.payroll.service.impl.LeaveServiceImpl;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;
    
    @Mock
    private EmployeeRepository employeeRepository;
    
    @Mock
    private SmartMessageService smartMessageService;

    @InjectMocks
    private LeaveServiceImpl leaveService;

    @Test
    void getAllLeaveRequests_Success() {
        // Arrange
        LeaveRequest leave = new LeaveRequest();
        leave.setLeaveId(1L);
        
        Employee emp = new Employee();
        emp.setFirstName("John");
        emp.setLastName("Doe");
        leave.setEmployee(emp);
        
        when(leaveRequestRepository.findAll()).thenReturn(Arrays.asList(leave));
        when(smartMessageService.generateLeaveStatusMessage(any())).thenReturn("AI Message");

        // Act
        var result = leaveService.getAllLeaveRequests();

        // Assert
        assertNotNull(result);
        verify(leaveRequestRepository).findAll();
    }

    @Test
    void getLeaveRequestById_Success() {
        // Arrange
        LeaveRequest leave = new LeaveRequest();
        leave.setLeaveId(1L);
        
        Employee emp = new Employee();
        emp.setFirstName("John");
        emp.setLastName("Doe");
        leave.setEmployee(emp);
        
        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(leave));
        when(smartMessageService.generateLeaveStatusMessage(any())).thenReturn("AI Message");

        // Act
        var result = leaveService.getLeaveRequestById(1L);

        // Assert
        assertNotNull(result);
        verify(leaveRequestRepository).findById(1L);
    }
}