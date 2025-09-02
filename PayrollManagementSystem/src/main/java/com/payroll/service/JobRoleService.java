// JobRoleService.java
package com.payroll.service;

import com.payroll.dto.JobRoleDto;
import java.util.List;

public interface JobRoleService {
    List<JobRoleDto> getAllJobRoles();
    JobRoleDto getJobRoleById(Long id);
    JobRoleDto createJobRole(JobRoleDto jobRoleDto);
    JobRoleDto updateJobRole(Long id, JobRoleDto jobRoleDto);
    void deleteJobRole(Long id);
}