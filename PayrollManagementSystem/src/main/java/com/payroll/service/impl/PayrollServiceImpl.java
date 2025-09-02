// PayrollServiceImpl.java
package com.payroll.service.impl;

import com.payroll.dto.PayrollDto;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.model.Employee;
import com.payroll.model.Payroll;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.PayrollRepository;
import com.payroll.service.PayrollService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PayrollServiceImpl implements PayrollService {
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollServiceImpl(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<PayrollDto> getAllPayrolls() {
        return payrollRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PayrollDto> getPayrollsByEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        return payrollRepository.findByEmployee(employee).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PayrollDto> getPayrollsByMonthAndYear(Integer month, Integer year) {
        return payrollRepository.findByMonthAndYear(month, year).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PayrollDto getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + id));
        return convertToDto(payroll);
    }

    @Override
    @Transactional
    public PayrollDto createPayroll(PayrollDto payrollDto) {
        Employee employee = employeeRepository.findById(payrollDto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + payrollDto.getEmployeeId()));
        
        // Check if payroll already exists for this employee and period
        if (payrollRepository.findByEmployeeAndMonthAndYear(employee, payrollDto.getMonth(), payrollDto.getYear()).isPresent()) {
            throw new RuntimeException("Payroll already exists for this employee and period");
        }
        
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setMonth(payrollDto.getMonth());
        payroll.setYear(payrollDto.getYear());
        payroll.setBaseSalary(payrollDto.getBaseSalary());
        payroll.setAllowances(payrollDto.getAllowances());
        payroll.setDeductions(payrollDto.getDeductions());
        payroll.setNetSalary(calculateNetSalary(payrollDto));
        
        Payroll savedPayroll = payrollRepository.save(payroll);
        return convertToDto(savedPayroll);
    }

    @Override
    @Transactional
    public PayrollDto processPayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + id));
        
        payroll.setStatus(Payroll.PayrollStatus.PROCESSED);
        payroll.setProcessedDate(LocalDateTime.now());
        
        Payroll processedPayroll = payrollRepository.save(payroll);
        return convertToDto(processedPayroll);
    }

    @Override
    public void deletePayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + id));
        payrollRepository.delete(payroll);
    }

    private PayrollDto convertToDto(Payroll payroll) {
        PayrollDto dto = new PayrollDto();
        dto.setPayrollId(payroll.getPayrollId());
        dto.setEmployeeId(payroll.getEmployee().getEmployeeId());
        dto.setMonth(payroll.getMonth());
        dto.setYear(payroll.getYear());
        dto.setBaseSalary(payroll.getBaseSalary());
        dto.setAllowances(payroll.getAllowances());
        dto.setDeductions(payroll.getDeductions());
        dto.setNetSalary(payroll.getNetSalary());
        dto.setStatus(payroll.getStatus().name());
        dto.setGeneratedDate(payroll.getGeneratedDate());
        dto.setProcessedDate(payroll.getProcessedDate());
        return dto;
    }

    private BigDecimal calculateNetSalary(PayrollDto payrollDto) {
        BigDecimal base = payrollDto.getBaseSalary() != null ? payrollDto.getBaseSalary() : BigDecimal.ZERO;
        BigDecimal allowances = payrollDto.getAllowances() != null ? payrollDto.getAllowances() : BigDecimal.ZERO;
        BigDecimal deductions = payrollDto.getDeductions() != null ? payrollDto.getDeductions() : BigDecimal.ZERO;
        
        return base.add(allowances).subtract(deductions);
    }
}