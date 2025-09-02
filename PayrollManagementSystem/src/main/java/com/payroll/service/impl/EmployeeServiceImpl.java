package com.payroll.service.impl;

import com.payroll.dto.EmployeeDto;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.model.Department;
import com.payroll.model.Employee;
import com.payroll.model.JobRole;
import com.payroll.model.User;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.JobRoleRepository;
import com.payroll.repository.UserRepository;
import com.payroll.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final JobRoleRepository jobRoleRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, UserRepository userRepository, 
                              DepartmentRepository departmentRepository, JobRoleRepository jobRoleRepository) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.jobRoleRepository = jobRoleRepository;
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return convertToDto(employee);
    }

    @Override
    public EmployeeDto getEmployeeByUserId(Long userId) {
        // Try to find existing employee
        Optional<Employee> existingEmployee = employeeRepository.findByUserUserId(userId);
        
        if (existingEmployee.isPresent()) {
            return convertToDto(existingEmployee.get());
        }
        
        // If not found, create a new employee record automatically
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // Auto-create employee record
        Employee employee = new Employee();
        employee.setUser(user);
        employee.setFirstName(user.getUsername());
        employee.setLastName("User");
        employee.setHireDate(LocalDate.now());
        employee.setLeaveBalance(20);
        
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDto(savedEmployee);
    }

    @Override
    @Transactional
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        User user = userRepository.findById(employeeDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + employeeDto.getUserId()));

        // Check if employee already exists for this user
        if (employeeRepository.findByUserUserId(employeeDto.getUserId()).isPresent()) {
            throw new RuntimeException("Employee already exists for this user");
        }

        Department department = null;
        if (employeeDto.getDepartmentId() != null) {
            department = departmentRepository.findById(employeeDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + employeeDto.getDepartmentId()));
        }

        JobRole jobRole = null;
        if (employeeDto.getJobId() != null) {
            jobRole = jobRoleRepository.findById(employeeDto.getJobId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + employeeDto.getJobId()));
        }

        Employee employee = new Employee();
        employee.setUser(user);
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setDateOfBirth(employeeDto.getDateOfBirth());
        employee.setPhoneNumber(employeeDto.getPhoneNumber());
        employee.setAddress(employeeDto.getAddress());
        employee.setHireDate(employeeDto.getHireDate());
        employee.setDepartment(department);
        employee.setJobRole(jobRole);
        employee.setLeaveBalance(employeeDto.getLeaveBalance() != null ? employeeDto.getLeaveBalance() : 20);

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDto(savedEmployee);
    }

    @Override
    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (employeeDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(employeeDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + employeeDto.getDepartmentId()));
            employee.setDepartment(department);
        } else {
            employee.setDepartment(null);
        }

        if (employeeDto.getJobId() != null) {
            JobRole jobRole = jobRoleRepository.findById(employeeDto.getJobId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + employeeDto.getJobId()));
            employee.setJobRole(jobRole);
        } else {
            employee.setJobRole(null);
        }

        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setDateOfBirth(employeeDto.getDateOfBirth());
        employee.setPhoneNumber(employeeDto.getPhoneNumber());
        employee.setAddress(employeeDto.getAddress());
        
        if (employeeDto.getLeaveBalance() != null) {
            employee.setLeaveBalance(employeeDto.getLeaveBalance());
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDto(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    private EmployeeDto convertToDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setUserId(employee.getUser().getUserId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setAddress(employee.getAddress());
        dto.setHireDate(employee.getHireDate());
        dto.setLeaveBalance(employee.getLeaveBalance());
        
        if (employee.getDepartment() != null) {
            dto.setDepartmentId(employee.getDepartment().getDepartmentId());
            dto.setDepartmentName(employee.getDepartment().getDepartmentName());
        }
        
        if (employee.getJobRole() != null) {
            dto.setJobId(employee.getJobRole().getJobId());
            dto.setJobTitle(employee.getJobRole().getJobTitle());
        }
        
        return dto;
    }
}