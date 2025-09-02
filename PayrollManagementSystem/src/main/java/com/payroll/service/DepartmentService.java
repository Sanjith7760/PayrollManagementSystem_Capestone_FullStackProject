// DepartmentService.java
package com.payroll.service;

import com.payroll.dto.DepartmentDto;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDto> getAllDepartments();
    DepartmentDto getDepartmentById(Long id);
    DepartmentDto createDepartment(DepartmentDto departmentDto);
    DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto);
    void deleteDepartment(Long id);
}
