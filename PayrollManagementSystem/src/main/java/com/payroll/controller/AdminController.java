package com.payroll.controller;

import com.payroll.dto.EmployeeDto;
import com.payroll.model.User;
import com.payroll.service.EmployeeService;
import com.payroll.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {
    private final UserService userService;
    private final EmployeeService employeeService;

    public AdminController(UserService userService, EmployeeService employeeService) {
        this.userService = userService;
        this.employeeService = employeeService;
    }

    // User Management Endpoints

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User createdUser = userService.createUser(
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getRole()
        );
        return ResponseEntity.ok(createdUser);
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        Boolean isActive = status.get("isActive");
        if (isActive == null) {
            throw new RuntimeException("isActive field is required");
        }

        if (isActive) {
            userService.activateUser(id);
        } else {
            userService.deactivateUser(id);
        }

        User updatedUser = userService.getUserById(id);
        return ResponseEntity.ok(updatedUser);
    }

    // Employee Management Endpoints

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping("/employees")
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.createEmployee(employeeDto));
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDto));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // Dashboard Statistics

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // This would typically call a service to get dashboard statistics
        // For now, returning placeholder data
        Map<String, Object> stats = Map.of(
            "totalEmployees", employeeService.getAllEmployees().size(),
            "pendingLeaveRequests", 5, // This would come from LeaveService
            "recentPayrolls", 3, // This would come from PayrollService
            "departmentDistribution", Map.of(
                "IT", 10,
                "HR", 5,
                "Finance", 8,
                "Operations", 7
            )
        );
        return ResponseEntity.ok(stats);
    }
}