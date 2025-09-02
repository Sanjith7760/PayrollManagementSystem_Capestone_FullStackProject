// LeaveRequestRepository.java
package com.payroll.repository;

import com.payroll.model.Employee;
import com.payroll.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee(Employee employee);
    List<LeaveRequest> findByStatus(LeaveRequest.LeaveStatus status);
    List<LeaveRequest> findByStartDateBetween(LocalDate start, LocalDate end);
}