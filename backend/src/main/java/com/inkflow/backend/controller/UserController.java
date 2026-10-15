package com.inkflow.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inkflow.backend.DTO.UserCreationRequest;
import com.inkflow.backend.service.UserService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

/**
 * UserController
 */

@RestController
@RequestMapping("/api/v1")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/auth/register")
  public ResponseEntity<String> register(@Valid @RequestBody UserCreationRequest request) {
    System.out.println(request);
    userService.register(request);
    return ResponseEntity.ok("User registered successfully");
  }

  @GetMapping("/user")
  public String getUser() {
    return "This route is authenticated";
  }

  @GetMapping("/other")
  public String getOther() {
    return "This route is not authenticated";
  }
}
