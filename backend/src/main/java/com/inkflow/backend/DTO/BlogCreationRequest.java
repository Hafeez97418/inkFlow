package com.inkflow.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogCreationRequest(
    @JsonProperty("title") @NotBlank(message = "Title is required") @Size(max = 255, message = "Title cannot exceed 255 characters") String title,

    @JsonProperty("content") @NotBlank(message = "Content is required") String content,

    @JsonProperty("published") Boolean published) {
  public BlogCreationRequest {
    if (published == null) {
      published = false;
    }
  }

}
