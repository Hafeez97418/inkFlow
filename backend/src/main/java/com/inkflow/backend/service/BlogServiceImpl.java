package com.inkflow.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.inkflow.backend.DTO.BlogCreationRequest;
import com.inkflow.backend.entity.Blog;
import com.inkflow.backend.entity.BlogRepository;
import com.inkflow.backend.entity.User;
import com.inkflow.backend.entity.UserRepository;
import com.inkflow.backend.error.DomainException.ResourceNotFound;

/**
 * BlogServiceImpl
 */
@Service
public class BlogServiceImpl implements BlogService {

  // invertion control (IOC)
  BlogRepository blogRepository;
  UserRepository userRepository;

  @Autowired
  public BlogServiceImpl(BlogRepository blogRepository, UserRepository userRepository) {
    this.blogRepository = blogRepository;
    this.userRepository = userRepository;
  }

  // CREATE BLOG
  @Override
  public Blog createBlog(BlogCreationRequest request, UserDetails userDetails) {

    String email = userDetails.getUsername();
    User user = userRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResourceNotFound("User not found"));

    Blog blog = new Blog(request.title(), request.content(), false, user);
    return blogRepository.save(blog);
  }

  // QUERY BLOGS
  @Override
  public List<Blog> getMyBlogs(UserDetails details) {
    return blogRepository.findBlogsByUserEmail(details.getUsername());
  }

  @Override
  public Blog findMySingleBlog(Long blogId, UserDetails userDetails) {
    Blog blog = blogRepository.findMySingleBlog(userDetails.getUsername(), blogId)
        .orElseThrow(() -> new ResourceNotFound("blog not found"));
    return blog;
  }

  @Override
  public Page<Blog> getAllBlogs(int page, int limit) {
    Pageable pageable = PageRequest.of(page, limit, Sort.by("createdAt").descending());
    return blogRepository.findPublishedBlogs(pageable);
  }

  @Override
  public Blog getSinglePublishedBlog(Long blogId) {
    return blogRepository.findSinglePublishedBlog(blogId).orElseThrow(() -> new ResourceNotFound("blog not found"));
  }

  // PUBLISH OR CONCEIL A BLOG
  @Override
  public boolean publish(boolean flag, Long blogId, UserDetails userDetails) {
    int result = blogRepository.updatePublished(flag, userDetails.getUsername(), blogId);
    if (result <= 0) {
      throw new ResourceNotFound("Update failed: Blog not found or unauthorized.");
    }
    return true;
  }

  // UPDATE BLOG
  @Override
  public Blog updateBlog(Long blogId, BlogCreationRequest request, UserDetails userDetails) {
    int result = blogRepository.updateBlog(
        request.title(),
        request.content(),
        userDetails.getUsername(),
        blogId);
    if (result <= 0) {
      throw new ResourceNotFound("Update failed: Blog not found or unauthorized.");
    }
    return this.findMySingleBlog(blogId, userDetails);
  }

  // DELETE BLOG
  @Override
  public boolean deleteBlog(Long blogId, UserDetails userDetails) {
    int result = blogRepository.deleteBlog(userDetails.getUsername(), blogId);
    if (result <= 0) {
      throw new ResourceNotFound("Delete failed: Blog not found");
    }
    return true;
  }

}
