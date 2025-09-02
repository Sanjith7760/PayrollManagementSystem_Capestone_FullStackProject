// PayrollService.java
package com.payroll.service;

import com.payroll.dto.PayrollDto;
import java.util.List;

public interface PayrollService {
    List<PayrollDto> getAllPayrolls();
    List<PayrollDto> getPayrollsByEmployee(Long employeeId);
    List<PayrollDto> getPayrollsByMonthAndYear(Integer month, Integer year);
    PayrollDto getPayrollById(Long id);
    PayrollDto createPayroll(PayrollDto payrollDto);
    PayrollDto processPayroll(Long id);
    void deletePayroll(Long id);
}
