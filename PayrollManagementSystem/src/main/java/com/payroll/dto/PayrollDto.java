// PayrollDto.java
package com.payroll.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PayrollDto {
    private Long payrollId;
    
    @NotNull
    private Long employeeId;
    
    @NotNull
    private Integer month;
    
    @NotNull
    private Integer year;
    
    private String aiMessage;
    
    @DecimalMin(value = "0.0")
    private BigDecimal baseSalary;
    
    @DecimalMin(value = "0.0")
    private BigDecimal allowances;
    
    @DecimalMin(value = "0.0")
    private BigDecimal deductions;
    
    @DecimalMin(value = "0.0")
    private BigDecimal netSalary;
    
    private String status;
    private LocalDateTime generatedDate;
    private LocalDateTime processedDate;
	public Long getPayrollId() {
		return payrollId;
	}
	public void setPayrollId(Long payrollId) {
		this.payrollId = payrollId;
	}
	public Long getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}
	public Integer getMonth() {
		return month;
	}
	public void setMonth(Integer month) {
		this.month = month;
	}
	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public BigDecimal getBaseSalary() {
		return baseSalary;
	}
	public void setBaseSalary(BigDecimal baseSalary) {
		this.baseSalary = baseSalary;
	}
	public BigDecimal getAllowances() {
		return allowances;
	}
	public void setAllowances(BigDecimal allowances) {
		this.allowances = allowances;
	}
	public BigDecimal getDeductions() {
		return deductions;
	}
	public void setDeductions(BigDecimal deductions) {
		this.deductions = deductions;
	}
	public BigDecimal getNetSalary() {
		return netSalary;
	}
	public void setNetSalary(BigDecimal netSalary) {
		this.netSalary = netSalary;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public LocalDateTime getGeneratedDate() {
		return generatedDate;
	}
	public void setGeneratedDate(LocalDateTime generatedDate) {
		this.generatedDate = generatedDate;
	}
	public LocalDateTime getProcessedDate() {
		return processedDate;
	}
	public void setProcessedDate(LocalDateTime processedDate) {
		this.processedDate = processedDate;
	}
    
    // Getters and setters
	public String getAiMessage() {
	    return aiMessage;
	}

	public void setAiMessage(String aiMessage) {
	    this.aiMessage = aiMessage;
	}
    
}