package com.payroll.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.payroll.model.User;
import com.payroll.repository.UserRepository;
import com.payroll.service.impl.UserServiceImpl;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void createUser_Success() {
        // Arrange
        User user = new User("john", "john@test.com", "encoded", User.Role.EMPLOYEE);
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User result = userService.createUser("john", "john@test.com", "password", User.Role.EMPLOYEE);

        // Assert
        assertEquals("john", result.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        // Arrange
        User user = new User("john", "john@test.com", "encoded", User.Role.EMPLOYEE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        User result = userService.getUserById(1L);

        // Assert
        assertEquals("john", result.getUsername());
    }
}