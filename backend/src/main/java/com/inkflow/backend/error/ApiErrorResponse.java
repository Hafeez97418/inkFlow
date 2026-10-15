package com.inkflow.backend.error;

import java.time.LocalDateTime;

/**
 * ApiErrorResponse
 */
public record ApiErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path) {
}
