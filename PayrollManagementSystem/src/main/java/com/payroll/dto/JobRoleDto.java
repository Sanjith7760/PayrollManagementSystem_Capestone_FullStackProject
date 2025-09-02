// JobRoleDto.java
package com.payroll.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public class JobRoleDto {
    private Long jobId;
    
    @NotBlank
    private String jobTitle;
    
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal baseSalary;
    
    private String description;

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public BigDecimal getBaseSalary() {
		return baseSalary;
	}

	public void setBaseSalary(BigDecimal baseSalary) {
		this.baseSalary = baseSalary;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
    
    // Getters and setters
    
}