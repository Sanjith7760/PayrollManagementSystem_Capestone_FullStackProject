package com.payroll.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.payroll.dto.DepartmentDto;
import com.payroll.model.Department;
import com.payroll.repository.DepartmentRepository;
import com.payroll.service.impl.DepartmentServiceImpl;

import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    @Test
    void getAllDepartments_Success() {
        // Arrange
        Department dept = new Department("IT", "Tech Department");
        when(departmentRepository.findAll()).thenReturn(Arrays.asList(dept));

        // Act
        var result = departmentService.getAllDepartments();

        // Assert
        assertEquals(1, result.size());
        assertEquals("IT", result.get(0).getDepartmentName());
    }

    @Test
    void createDepartment_Success() {
        // Arrange
        DepartmentDto dto = new DepartmentDto();
        dto.setDepartmentName("HR");
        dto.setDescription("Human Resources");
        
        Department savedDept = new Department("HR", "Human Resources");
        savedDept.setDepartmentId(1L);
        
        when(departmentRepository.existsByDepartmentName("HR")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(savedDept);

        // Act
        DepartmentDto result = departmentService.createDepartment(dto);

        // Assert
        assertEquals("HR", result.getDepartmentName());
        verify(departmentRepository).save(any(Department.class));
    }
}