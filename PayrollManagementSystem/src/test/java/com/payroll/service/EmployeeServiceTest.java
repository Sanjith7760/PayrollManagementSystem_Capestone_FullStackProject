package com.payroll.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.payroll.dto.EmployeeDto;
import com.payroll.model.Employee;
import com.payroll.model.User;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.UserRepository;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.JobRoleRepository;
import com.payroll.service.impl.EmployeeServiceImpl;

import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private DepartmentRepository departmentRepository;
    
    @Mock
    private JobRoleRepository jobRoleRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @Test
    void getAllEmployees_Success() {
        // Arrange
        User user = new User();
        user.setUserId(1L);
        
        Employee emp = new Employee();
        emp.setEmployeeId(1L);
        emp.setFirstName("John");
        emp.setUser(user);  // Add User to Employee
        
        when(employeeRepository.findAll()).thenReturn(Arrays.asList(emp));

        // Act
        var result = employeeService.getAllEmployees();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        verify(employeeRepository).findAll();
    }

    @Test
    void getEmployeeById_Success() {
        // Arrange
        User user = new User();
        user.setUserId(1L);
        
        Employee emp = new Employee();
        emp.setEmployeeId(1L);
        emp.setFirstName("John");
        emp.setUser(user);  // Add User to Employee
        
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(emp));

        // Act
        EmployeeDto result = employeeService.getEmployeeById(1L);

        // Assert
        assertNotNull(result);
        verify(employeeRepository).findById(1L);
    }
}