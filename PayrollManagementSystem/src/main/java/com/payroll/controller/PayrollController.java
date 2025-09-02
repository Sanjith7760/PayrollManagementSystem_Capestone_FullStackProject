// PayrollController.java
package com.payroll.controller;

import com.payroll.dto.PayrollDto;
import com.payroll.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payroll")
@CrossOrigin(origins = "http://localhost:3000")
public class PayrollController {
    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PayrollDto>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnData(authentication, #employeeId)")
    public ResponseEntity<List<PayrollDto>> getPayrollsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getPayrollsByEmployee(employeeId));
    }

    @GetMapping("/period")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PayrollDto>> getPayrollsByMonthAndYear(
            @RequestParam Integer month, 
            @RequestParam Integer year) {
        return ResponseEntity.ok(payrollService.getPayrollsByMonthAndYear(month, year));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @securityService.isOwnPayroll(authentication, #id)")
    public ResponseEntity<PayrollDto> getPayrollById(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PayrollDto> createPayroll(@Valid @RequestBody PayrollDto payrollDto) {
        return ResponseEntity.ok(payrollService.createPayroll(payrollDto));
    }

    @PatchMapping("/{id}/process")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PayrollDto> processPayroll(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.processPayroll(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
        return ResponseEntity.noContent().build();
    }
}