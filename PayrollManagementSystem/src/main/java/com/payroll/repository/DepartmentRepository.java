// DepartmentRepository.java
package com.payroll.repository;

import com.payroll.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentName(String departmentName);
    Boolean existsByDepartmentName(String departmentName);
}
