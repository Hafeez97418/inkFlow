package com.inkflow.backend.error;

import java.time.LocalDateTime;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.inkflow.backend.error.DomainException.BadRequestException;

import com.inkflow.backend.error.DomainException.ResourceNotFound;
import com.inkflow.backend.error.DomainException.UnauthorizedAction;

/**
 * GlobalExceptionalHandler
 */
@ControllerAdvice
public class GlobalExceptionalHandler {

  ErrorUtils utils;

  GlobalExceptionalHandler() {
    this.utils = new ErrorUtils();
  }

  // Resource not found
  @ExceptionHandler(ResourceNotFound.class)
  public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
      ResourceNotFound ex, WebRequest request) {
    ApiErrorResponse error = new ApiErrorResponse(
        LocalDateTime.now(),
        HttpStatus.NOT_FOUND.value(),
        HttpStatus.NOT_FOUND.getReasonPhrase(),
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
  }

  // Unauthorized Access
  @ExceptionHandler(UnauthorizedAction.class)
  public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
      UnauthorizedAction ex, WebRequest request) {
    ApiErrorResponse error = new ApiErrorResponse(
        LocalDateTime.now(),
        HttpStatus.UNAUTHORIZED.value(),
        HttpStatus.UNAUTHORIZED.getReasonPhrase(),
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
  }

  // 2. Handle Custom BadRequestException (400 Bad Request)
  @ExceptionHandler({ BadRequestException.class, MethodArgumentNotValidException.class,
      DataIntegrityViolationException.class })
  public ResponseEntity<ApiErrorResponse> handleBadRequest(
      Exception ex, WebRequest request) {

    String message = utils.getCleanMessage(ex);
    if (ex instanceof DataIntegrityViolationException diEx) {
      message = utils.parseDatabaseError(diEx);
    }
    ApiErrorResponse error = new ApiErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        HttpStatus.BAD_REQUEST.getReasonPhrase(),
        message,
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleGlobalException(
      Exception ex, WebRequest request) {

    ApiErrorResponse error = new ApiErrorResponse(
        LocalDateTime.now(),
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
        "An unexpected error occurred: " + ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }

}
