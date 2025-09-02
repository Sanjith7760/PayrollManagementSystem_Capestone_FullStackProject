// DepartmentDto.java
package com.payroll.dto;

import jakarta.validation.constraints.NotBlank;

public class DepartmentDto {
    private Long departmentId;
    
    @NotBlank
    private String departmentName;
    
    private String description;

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
    
    // Getters and setters
    
}