package com.payroll.service;

import com.payroll.model.Employee;
import com.payroll.model.LeaveRequest;
import com.payroll.model.Payroll;
import com.payroll.model.User;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.LeaveRequestRepository;
import com.payroll.repository.PayrollRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {
    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    public SecurityService(EmployeeRepository employeeRepository, 
                          LeaveRequestRepository leaveRequestRepository,
                          PayrollRepository payrollRepository) {
        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
    }

    public boolean isOwnData(Authentication authentication, Long employeeId) {
        User user = (User) authentication.getPrincipal();
        Employee employee = employeeRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return employee.getEmployeeId().equals(employeeId);
    }

    public boolean isOwnUser(Authentication authentication, Long userId) {
        User user = (User) authentication.getPrincipal();
        return user.getUserId().equals(userId);
    }

    public boolean isOwnLeaveRequest(Authentication authentication, Long leaveRequestId) {
        User user = (User) authentication.getPrincipal();
        Employee employee = employeeRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        return leaveRequest.getEmployee().getEmployeeId().equals(employee.getEmployeeId());
    }

    public boolean isOwnPayroll(Authentication authentication, Long payrollId) {
        User user = (User) authentication.getPrincipal();
        Employee employee = employeeRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));
        
        return payroll.getEmployee().getEmployeeId().equals(employee.getEmployeeId());
    }
}