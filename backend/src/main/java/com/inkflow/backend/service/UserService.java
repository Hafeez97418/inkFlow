package com.inkflow.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.inkflow.backend.DTO.UserCreationRequest;
import com.inkflow.backend.entity.User;
import com.inkflow.backend.entity.UserRepository;

/**
 * UserService
 */
@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User register(UserCreationRequest request) {
    User user = new User(request.firstName(), request.lastName(), request.email(),
        passwordEncoder.encode(request.password()));
    return userRepository.save(user);
  }
}
