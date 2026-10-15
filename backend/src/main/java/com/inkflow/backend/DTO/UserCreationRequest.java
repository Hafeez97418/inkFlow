package com.inkflow.backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreationRequest(
    @NotBlank(message = "First name is required") @Size(max = 50, message = "First name cannot exceed 50 characters") String firstName,

    @NotBlank(message = "Last name is required") @Size(max = 50, message = "Last name cannot exceed 50 characters") String lastName,

    @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") @Size(max = 100, message = "Email cannot exceed 100 characters") String email,

    @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") String password) {
}
