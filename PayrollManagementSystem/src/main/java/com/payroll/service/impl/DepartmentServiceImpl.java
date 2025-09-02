// DepartmentServiceImpl.java
package com.payroll.service.impl;

import com.payroll.dto.DepartmentDto;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.model.Department;
import com.payroll.repository.DepartmentRepository;
import com.payroll.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return convertToDto(department);
    }

    @Override
    @Transactional
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        if (departmentRepository.existsByDepartmentName(departmentDto.getDepartmentName())) {
            throw new RuntimeException("Department with name '" + departmentDto.getDepartmentName() + "' already exists");
        }
        
        Department department = new Department();
        department.setDepartmentName(departmentDto.getDepartmentName());
        department.setDescription(departmentDto.getDescription());
        
        Department savedDepartment = departmentRepository.save(department);
        return convertToDto(savedDepartment);
    }

    @Override
    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        if (!department.getDepartmentName().equals(departmentDto.getDepartmentName()) && 
            departmentRepository.existsByDepartmentName(departmentDto.getDepartmentName())) {
            throw new RuntimeException("Department with name '" + departmentDto.getDepartmentName() + "' already exists");
        }
        
        department.setDepartmentName(departmentDto.getDepartmentName());
        department.setDescription(departmentDto.getDescription());
        
        Department updatedDepartment = departmentRepository.save(department);
        return convertToDto(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        
        if (!department.getEmployees().isEmpty()) {
            throw new RuntimeException("Cannot delete department with assigned employees");
        }
        
        departmentRepository.delete(department);
    }

    private DepartmentDto convertToDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setDepartmentId(department.getDepartmentId());
        dto.setDepartmentName(department.getDepartmentName());
        dto.setDescription(department.getDescription());
        return dto;
    }
}