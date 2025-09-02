package com.payroll.service.impl;

import com.payroll.dto.EmployeeDto;
import com.payroll.model.User;
import com.payroll.repository.UserRepository;
import com.payroll.service.EmployeeService;
import com.payroll.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeService employeeService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, EmployeeService employeeService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.employeeService = employeeService;
    }

    @Override
    @Transactional
    public User createUser(String username, String email, String password, User.Role role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        // ENCODE THE PASSWORD
        String encodedPassword = passwordEncoder.encode(password);
        
        // USE DEFAULT CONSTRUCTOR AND SETTERS
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setRole(role);
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        
     // Check if role is EMPLOYEE and create employee record
        if (role == User.Role.EMPLOYEE) {
            try {
                EmployeeDto employeeDto = new EmployeeDto();
                employeeDto.setUserId(savedUser.getUserId());
                employeeDto.setFirstName(username);
                employeeDto.setLastName("User"); // ✅ FIX: Use "User" instead of ""
                employeeDto.setHireDate(LocalDate.now());
                employeeDto.setLeaveBalance(20);
                
                employeeService.createEmployee(employeeDto);
            } catch (Exception e) {
                // Don't throw exception, just log it
                System.err.println("Note: Employee record creation failed: " + e.getMessage());
                // Continue with user registration anyway
            }
        }
        
        return savedUser;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(true);
        userRepository.save(user);
    }
}