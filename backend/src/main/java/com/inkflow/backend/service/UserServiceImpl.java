package com.inkflow.backend.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.inkflow.backend.DTO.UserCreationRequest;
import com.inkflow.backend.DTO.UserDetailsResponse;
import com.inkflow.backend.entity.User;
import com.inkflow.backend.entity.UserRepository;
import com.inkflow.backend.error.DomainException.ResourceNotFound;

import jakarta.transaction.Transactional;

/**
 * UserService
 */
@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public User register(UserCreationRequest request) {
    User user = new User(request.firstName(), request.lastName(), request.email(),
        passwordEncoder.encode(request.password()));
    return userRepository.save(user);
  }

  // NOTE: this is only required for JWT Auth and we are using Basic auth for now

  /*
   * public boolean login(UserLoginRequest request) {
   * User user = userRepository.findByEmail(request.email())
   * .orElseThrow(() -> new UnauthorizedAction("Invalid credentials"));
   * return passwordEncoder.matches(request.password(), user.getPassword());
   * }
   */

  public UserDetailsResponse getUser(UserDetails userDetails) {
    String email = userDetails.getUsername();
    User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFound("User not found"));
    return new UserDetailsResponse(email, user.getFirstName(), user.getLastName());
  }
}
