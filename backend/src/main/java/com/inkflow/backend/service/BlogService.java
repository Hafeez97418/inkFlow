package com.inkflow.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;

import com.inkflow.backend.DTO.BlogCreationRequest;
import com.inkflow.backend.entity.Blog;

/**
 * BlogService
 */
public interface BlogService {

  public Blog createBlog(BlogCreationRequest request, UserDetails details);

  public List<Blog> getMyBlogs(UserDetails userDetails);

  public boolean publish(boolean flag, Long blogId, UserDetails userDetails);

  public Blog findMySingleBlog(Long blogId, UserDetails userDetails);

  public Page<Blog> getAllBlogs(int page, int limit);

  public Blog getSinglePublishedBlog(Long blogId);

  public Blog updateBlog(Long blogId, BlogCreationRequest request, UserDetails userDetails);

  public boolean deleteBlog(Long blogId, UserDetails userDetails);
}
