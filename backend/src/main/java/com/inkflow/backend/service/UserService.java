package com.inkflow.backend.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.inkflow.backend.DTO.UserCreationRequest;
import com.inkflow.backend.entity.User;

/**
 * UserService
 */
public interface UserService {
  public User register(UserCreationRequest request);

  public User getUser(UserDetails userDetails);
}
