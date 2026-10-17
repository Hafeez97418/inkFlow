package com.inkflow.backend.controller;

import java.time.LocalDateTime;

/**
 * ApiResponse
 */

public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    Object error, // Can hold a String message or a structured validation map/object
    LocalDateTime timestamp) {

  // Convenience factory method for successful responses with data
  public static <T> ApiResponse<T> success(T data, String message) {
    return new ApiResponse<>(true, message, data, null, LocalDateTime.now());
  }

  // Convenience factory method for successful responses with no data (e.g.,
  // deletions)
  public static <T> ApiResponse<T> success(String message) {
    return new ApiResponse<>(true, message, null, null, LocalDateTime.now());
  }

  // Convenience factory method for error responses
  public static <T> ApiResponse<T> error(Object error, String message) {
    return new ApiResponse<>(false, message, null, error, LocalDateTime.now());
  }
}
