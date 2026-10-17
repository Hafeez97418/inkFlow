package com.inkflow.backend.controller;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inkflow.backend.DTO.UserCreationRequest;
import com.inkflow.backend.entity.User;
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

  public UserController(@Qualifier("userServiceImpl") UserService userService) {
    this.userService = userService;
  }

  // register
  @PostMapping("/auth/register")
  public ApiResponse<String> register(@Valid @RequestBody UserCreationRequest request) {
    userService.register(request);
    return ApiResponse.success("User created successfully");
  }

  /*
   * NOTE: this is only required for JWT Auth and we are using Basic auth for now
   *
   * @PostMapping("/auth/login")
   * public ApiResponse<String> login(@Valid @RequestBody UserLoginRequest
   * request) {
   * boolean isLoggedIn = userService.login(request);
   * if (!isLoggedIn) {
   * throw new UnauthorizedAction("Invalid credentials");
   * }
   * return ApiResponse.success("User successfully authenticated");
   * }
   */

  // TODO: logout endpoint when we implement JWT
  /*
   * @PostMapping("/auth/logout")
   * public ApiResponse<String> logout() {
   * return ApiResponse.success("User successfully logged out");
   * }
   */

  @GetMapping("/user")
  public ApiResponse<User> getUser(@AuthenticationPrincipal UserDetails userDetails) {
    User user = userService.getUser(userDetails);
    return ApiResponse.success(user, "user fetched");
  }

}
