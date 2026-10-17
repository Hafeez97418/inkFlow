package com.inkflow.backend.DTO;

/**
 * UserDetailsResponse
 */
public record UserDetailsResponse(
    String email,
    String firstName,
    String lastname) {
  public UserDetailsResponse {
  }
}
