package com.payroll.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_roles")
@EntityListeners(AuditingEntityListener.class)
public class JobRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    @NotBlank
    @Column(unique = true)
    private String jobTitle;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal baseSalary;

    private String description;

    @OneToMany(mappedBy = "jobRole", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public JobRole() {
    }

    public JobRole(String jobTitle, BigDecimal baseSalary, String description) {
        this.jobTitle = jobTitle;
        this.baseSalary = baseSalary;
        this.description = description;
    }

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

	public List<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(List<Employee> employees) {
		this.employees = employees;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

    // Getters and setters
    
}