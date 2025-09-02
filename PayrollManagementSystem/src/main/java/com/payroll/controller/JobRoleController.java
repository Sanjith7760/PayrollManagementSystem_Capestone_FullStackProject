// JobRoleController.java
package com.payroll.controller;

import com.payroll.dto.JobRoleDto;
import com.payroll.service.JobRoleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobRoleController {
    private final JobRoleService jobRoleService;

    public JobRoleController(JobRoleService jobRoleService) {
        this.jobRoleService = jobRoleService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<JobRoleDto>> getAllJobRoles() {
        return ResponseEntity.ok(jobRoleService.getAllJobRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JobRoleDto> getJobRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(jobRoleService.getJobRoleById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JobRoleDto> createJobRole(@Valid @RequestBody JobRoleDto jobRoleDto) {
        return ResponseEntity.ok(jobRoleService.createJobRole(jobRoleDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<JobRoleDto> updateJobRole(@PathVariable Long id, @Valid @RequestBody JobRoleDto jobRoleDto) {
        return ResponseEntity.ok(jobRoleService.updateJobRole(id, jobRoleDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteJobRole(@PathVariable Long id) {
        jobRoleService.deleteJobRole(id);
        return ResponseEntity.noContent().build();
    }
}