// UserService.java
package com.payroll.service;

import com.payroll.model.User;

public interface UserService {
    User createUser(String username, String email, String password, User.Role role);
    User getUserById(Long id);
    User getUserByUsername(String username);
    void deactivateUser(Long id);
    void activateUser(Long id);
}