package com.inkflow.backend.entity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

/**
 * BlogRepository
 */
public interface BlogRepository extends JpaRepository<Blog, Long> {

  @Query("SELECT b FROM Blog b WHERE b.user.email = :email")
  List<Blog> findBlogsByUserEmail(@Param("email") String email);

  @Query("SELECT b FROM Blog b WHERE b.user.email = :email and b.blogId = :blogId")
  Optional<Blog> findMySingleBlog(@Param("email") String email, @Param("blogId") Long blogId);

  @Query("SELECT b FROM Blog b WHERE b.published = true")
  Page<Blog> findPublishedBlogs(Pageable pageable);

  @Query("SELECT b FROM Blog b WHERE b.published = true and b.blogId = :blogId")
  Optional<Blog> findSinglePublishedBlog(@Param("blogId") Long blogId);

  @Transactional
  @Modifying
  @Query("UPDATE Blog b SET b.published = :flag WHERE b.user.email = :email and b.blogId = :blogId")
  int updatePublished(@Param("flag") boolean flag, @Param("email") String email, @Param("blogId") Long blogId);

  @Transactional
  @Modifying
  @Query("UPDATE Blog b SET b.title = :title, b.content = :content WHERE b.user.email = :email and b.blogId = :blogId")
  int updateBlog(
      @Param("title") String title,
      @Param("content") String content,
      @Param("email") String email,
      @Param("blogId") Long blogId);

  @Transactional
  @Modifying
  @Query("DELETE from Blog b WHERE b.user.email = :email and b.blogId = :blogId")
  int deleteBlog(@Param("email") String email, @Param("blogId") Long blogId);

}
