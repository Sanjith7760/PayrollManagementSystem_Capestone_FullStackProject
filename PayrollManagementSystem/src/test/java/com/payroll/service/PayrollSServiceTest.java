package com.payroll.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.payroll.dto.PayrollDto;
import com.payroll.model.Employee;
import com.payroll.model.Payroll;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.PayrollRepository;
import com.payroll.service.impl.PayrollServiceImpl;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class PayrollServiceTest {

    @Mock
    private PayrollRepository payrollRepository;
    
    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private PayrollServiceImpl payrollService;

    @Test
    void getAllPayrolls_Success() {
        // Arrange
        Payroll payroll = new Payroll();
        payroll.setPayrollId(1L);
        payroll.setMonth(6);
        payroll.setYear(2024);
        
        Employee emp = new Employee();
        emp.setEmployeeId(1L);
        payroll.setEmployee(emp);
        
        when(payrollRepository.findAll()).thenReturn(Arrays.asList(payroll));

        // Act
        var result = payrollService.getAllPayrolls();

        // Assert
        assertNotNull(result);
        verify(payrollRepository).findAll();
    }

    @Test
    void getPayrollById_Success() {
        // Arrange
        Payroll payroll = new Payroll();
        payroll.setPayrollId(1L);
        
        Employee emp = new Employee();
        emp.setEmployeeId(1L);
        payroll.setEmployee(emp);
        
        when(payrollRepository.findById(1L)).thenReturn(Optional.of(payroll));

        // Act
        var result = payrollService.getPayrollById(1L);

        // Assert
        assertNotNull(result);
        verify(payrollRepository).findById(1L);
    }
}