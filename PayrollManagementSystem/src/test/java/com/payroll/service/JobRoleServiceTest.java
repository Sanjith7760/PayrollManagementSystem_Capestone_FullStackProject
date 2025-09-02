package com.payroll.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.payroll.dto.JobRoleDto;
import com.payroll.model.JobRole;
import com.payroll.repository.JobRoleRepository;
import com.payroll.service.impl.JobRoleServiceImpl;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class JobRoleServiceTest {

    @Mock
    private JobRoleRepository jobRoleRepository;

    @InjectMocks
    private JobRoleServiceImpl jobRoleService;

    @Test
    void getAllJobRoles_Success() {
        // Arrange
        JobRole job = new JobRole("Developer", new BigDecimal("50000"), "Software Developer");
        job.setJobId(1L);
        when(jobRoleRepository.findAll()).thenReturn(Arrays.asList(job));

        // Act
        var result = jobRoleService.getAllJobRoles();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        verify(jobRoleRepository).findAll();
    }

    @Test
    void getJobRoleById_Success() {
        // Arrange
        JobRole job = new JobRole("Developer", new BigDecimal("50000"), "Software Developer");
        job.setJobId(1L);
        when(jobRoleRepository.findById(1L)).thenReturn(Optional.of(job));

        // Act
        JobRoleDto result = jobRoleService.getJobRoleById(1L);

        // Assert
        assertNotNull(result);
        verify(jobRoleRepository).findById(1L);
    }
}