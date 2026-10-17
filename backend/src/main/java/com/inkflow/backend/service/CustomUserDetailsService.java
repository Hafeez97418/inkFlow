package com.inkflow.backend.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.inkflow.backend.entity.UserRepository;

/**
 * CustomUserDetailsService
 */

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    com.inkflow.backend.entity.User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return
    // NOTE: the User mentioned below is from userDetails class not an specified
    // entity
    User.withUsername(user.getEmail())
        .password(user.getPassword())
        .roles("USER")
        .build();
  }

}
