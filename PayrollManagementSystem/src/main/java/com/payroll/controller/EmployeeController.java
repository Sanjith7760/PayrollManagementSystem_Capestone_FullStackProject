// EmployeeController.java
package com.payroll.controller;

import com.payroll.dto.EmployeeDto;
import com.payroll.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnData(authentication, #id)")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnUser(authentication, #userId)")
    public ResponseEntity<EmployeeDto> getEmployeeByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(employeeService.getEmployeeByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.createEmployee(employeeDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnData(authentication, #id)")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}