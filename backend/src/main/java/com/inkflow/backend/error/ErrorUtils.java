package com.inkflow.backend.error;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;

interface ErrorUtilsInterface {
  public String getCleanMessage(Exception ex);

  public String parseDatabaseError(DataIntegrityViolationException ex);
}

public class ErrorUtils implements ErrorUtilsInterface {
  public String getCleanMessage(Exception ex) {
    return (ex instanceof MethodArgumentNotValidException validEx)
        ? validEx.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(java.util.stream.Collectors.joining(", "))
        : ex.getMessage();
  }

  public String parseDatabaseError(DataIntegrityViolationException ex) {
    Throwable rootCause = ex.getRootCause();

    if (rootCause instanceof java.sql.SQLException sqlEx) {
      String sqlState = sqlEx.getSQLState();
      String rawMessage = sqlEx.getMessage(); // Your raw error message string

      // Check for Unique Constraint Violation (SQL State 23000)
      if ("23000".equals(sqlState) || sqlEx.getErrorCode() == 1062) {

        // Specifically looking for the 'email' key violation
        if (rawMessage != null && rawMessage.toLowerCase().contains("'email'")) {

          // Regex to extract the value inside the single quotes right after "Duplicate
          // entry"
          Pattern pattern = Pattern.compile("Duplicate entry '([^']+)'");
          Matcher matcher = pattern.matcher(rawMessage);

          if (matcher.find()) {
            String duplicateEmail = matcher.group(1); // Extracts "hafeez@example.com"
            return String.format("An account with email '%s' already exists.", duplicateEmail);
          }

          // Fallback if regex fails but we know it's an email clash
          return "The provided email address is already registered.";
        }

        // Fallback for OTHER unique constraint violations (e.g., username, phone)
        return "This record already exists in our system.";
      }
    }
    return "Database constraint violation occurred.";
  }
}
