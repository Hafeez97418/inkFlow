package com.inkflow.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inkflow.backend.DTO.BlogCreationRequest;
import com.inkflow.backend.entity.Blog;
import com.inkflow.backend.service.BlogService;

import jakarta.validation.Valid;

/**
 * BlogController
 */

@RestController
@RequestMapping("api/v1")
public class BlogController {

  BlogService blogService;

  public BlogController(BlogService blogService) {
    this.blogService = blogService;
  }

  @PostMapping("/blogs")
  public ApiResponse<Blog> createBlog(@Valid @RequestBody BlogCreationRequest request,
      @AuthenticationPrincipal UserDetails details) {
    Blog blog = blogService.createBlog(request, details);
    return ApiResponse.success(blog, "blog created successfully");
  }

  @GetMapping("/blogs")
  public ApiResponse<Page<Blog>> getAllBlogs(
      @RequestParam(required = false, defaultValue = "0") int page,
      @RequestParam(required = false, defaultValue = "10") int limit) {
    return ApiResponse.success(blogService.getAllBlogs(page, limit), "all blogs fetched successfully");
  }

  @GetMapping("/blogs/{blogId}")
  public ApiResponse<Blog> getSinglePublishedBlog(@PathVariable("blogId") Long blogId) {
    return ApiResponse.success(blogService.getSinglePublishedBlog(blogId), "blog found successfully");
  }

  @PutMapping("/blogs/{blogId}")
  public ApiResponse<Blog> updateBlog(
      @PathVariable("blogId") Long blogId,
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody BlogCreationRequest request) {
    System.out.println(request);
    return ApiResponse.success(blogService.updateBlog(blogId, request, userDetails), "blog updated successfully");
  }

  @DeleteMapping("/blogs/{blogId}")
  public ApiResponse<Boolean> deleteBlog(
      @PathVariable("blogId") Long blogId,
      @AuthenticationPrincipal UserDetails userDetails) {
    return ApiResponse.success(blogService.deleteBlog(blogId, userDetails), "blog deleted successfully");
  }

  @GetMapping("/blogs/me")
  public ApiResponse<List<Blog>> getMyBlogs(@AuthenticationPrincipal UserDetails userDetails) {
    return ApiResponse.success(blogService.getMyBlogs(userDetails), "user blogs");
  }

  @GetMapping("/blogs/me/{blogId}")
  public ApiResponse<Blog> getMyBlogs(@AuthenticationPrincipal UserDetails userDetails,
      @PathVariable("blogId") Long blogId) {
    return ApiResponse.success(blogService.findMySingleBlog(blogId, userDetails), "users single blog");
  }

  @PatchMapping("/blogs/publish/{blogId}")
  public ApiResponse<Boolean> postBlog(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable("blogId") Long blogId,
      @RequestParam(required = false, defaultValue = "true") boolean flag) {
    boolean publish = blogService.publish(flag, blogId, userDetails);
    return ApiResponse.success(publish, "Blog posted successfully");
  }

}
