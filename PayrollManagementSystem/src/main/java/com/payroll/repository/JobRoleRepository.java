// JobRoleRepository.java
package com.payroll.repository;

import com.payroll.model.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    Optional<JobRole> findByJobTitle(String jobTitle);
    Boolean existsByJobTitle(String jobTitle);
}