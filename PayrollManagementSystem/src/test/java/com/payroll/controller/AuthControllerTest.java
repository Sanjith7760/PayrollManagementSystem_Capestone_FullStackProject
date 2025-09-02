package com.payroll.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

import com.payroll.config.JwtService;
import com.payroll.dto.AuthRequest;
import com.payroll.dto.AuthResponse;
import com.payroll.model.User;
import com.payroll.service.UserService;
import com.payroll.service.WelcomeAIService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private UserService userService;
    @Mock
    private WelcomeAIService welcomeAIService;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    @Test
    void login_Success() {
        // Arrange
        User user = new User("john", "john@test.com", "pass", User.Role.EMPLOYEE);
        AuthRequest request = new AuthRequest();
        request.setUsername("john");
        request.setPassword("pass");
        
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        // Act
        var response = authController.login(request);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("jwt-token", response.getBody().getAccessToken());
    }

    @Test
    void getWelcomeMessage_Success() {
        // Arrange
        User user = new User("john", "john@test.com", "pass", User.Role.EMPLOYEE);
        when(welcomeAIService.generateSmartWelcome(user)).thenReturn("Welcome john!");

        // Act
        var response = authController.getWelcomeMessage(user);

        // Assert
        assertEquals("Welcome john!", response.getBody());
        verify(welcomeAIService).generateSmartWelcome(user);
    }
}