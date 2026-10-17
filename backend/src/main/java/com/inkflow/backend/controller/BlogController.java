package com.inkflow.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BlogController
 */

@RestController
@RequestMapping("api/v1")
public class BlogController {

  @PostMapping("/blogs")
  public String createBlog() {
    return "blog created";
  }

}
