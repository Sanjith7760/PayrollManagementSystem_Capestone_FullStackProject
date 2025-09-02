// JobRoleServiceImpl.java
package com.payroll.service.impl;

import com.payroll.dto.JobRoleDto;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.model.JobRole;
import com.payroll.repository.JobRoleRepository;
import com.payroll.service.JobRoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobRoleServiceImpl implements JobRoleService {
    private final JobRoleRepository jobRoleRepository;

    public JobRoleServiceImpl(JobRoleRepository jobRoleRepository) {
        this.jobRoleRepository = jobRoleRepository;
    }

    @Override
    public List<JobRoleDto> getAllJobRoles() {
        return jobRoleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobRoleDto getJobRoleById(Long id) {
        JobRole jobRole = jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + id));
        return convertToDto(jobRole);
    }

    @Override
    @Transactional
    public JobRoleDto createJobRole(JobRoleDto jobRoleDto) {
        if (jobRoleRepository.existsByJobTitle(jobRoleDto.getJobTitle())) {
            throw new RuntimeException("Job role with title '" + jobRoleDto.getJobTitle() + "' already exists");
        }
        
        JobRole jobRole = new JobRole();
        jobRole.setJobTitle(jobRoleDto.getJobTitle());
        jobRole.setBaseSalary(jobRoleDto.getBaseSalary());
        jobRole.setDescription(jobRoleDto.getDescription());
        
        JobRole savedJobRole = jobRoleRepository.save(jobRole);
        return convertToDto(savedJobRole);
    }

    @Override
    @Transactional
    public JobRoleDto updateJobRole(Long id, JobRoleDto jobRoleDto) {
        JobRole jobRole = jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + id));
        
        if (!jobRole.getJobTitle().equals(jobRoleDto.getJobTitle()) && 
            jobRoleRepository.existsByJobTitle(jobRoleDto.getJobTitle())) {
            throw new RuntimeException("Job role with title '" + jobRoleDto.getJobTitle() + "' already exists");
        }
        
        jobRole.setJobTitle(jobRoleDto.getJobTitle());
        jobRole.setBaseSalary(jobRoleDto.getBaseSalary());
        jobRole.setDescription(jobRoleDto.getDescription());
        
        JobRole updatedJobRole = jobRoleRepository.save(jobRole);
        return convertToDto(updatedJobRole);
    }

    @Override
    public void deleteJobRole(Long id) {
        JobRole jobRole = jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + id));
        
        if (!jobRole.getEmployees().isEmpty()) {
            throw new RuntimeException("Cannot delete job role with assigned employees");
        }
        
        jobRoleRepository.delete(jobRole);
    }

    private JobRoleDto convertToDto(JobRole jobRole) {
        JobRoleDto dto = new JobRoleDto();
        dto.setJobId(jobRole.getJobId());
        dto.setJobTitle(jobRole.getJobTitle());
        dto.setBaseSalary(jobRole.getBaseSalary());
        dto.setDescription(jobRole.getDescription());
        return dto;
    }
}