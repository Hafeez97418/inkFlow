package com.inkflow.backend.error;

/**
 * DomainException
 */
public class DomainException extends RuntimeException {

  public DomainException(String message) {
    super(message);
  }

  public DomainException(String message, Throwable cause) {
    super(message, cause);
  }

  public static class ResourceNotFound extends DomainException {
    public ResourceNotFound(String message) {
      super(message);
    }
  }

  public static class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
      super(message);
    }
  }

  public static class UnauthorizedAction extends DomainException {
    public UnauthorizedAction(String message) {
      super(message);
    }
  }
}
