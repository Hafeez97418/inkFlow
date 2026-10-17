package com.inkflow.backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * UserLoginRequest
 */
// NOTE: not required now only required when JWT gets implemented
public record UserLoginRequest(
    @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") @Size(max = 100, message = "Email cannot exceed 100 characters") String email,

    @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") String password) {
}
