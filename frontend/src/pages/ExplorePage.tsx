import React, { useEffect, useState, useCallback } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  Skeleton,
  Alert,
  Chip,
  Paper,
} from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditIcon from '@mui/icons-material/Edit'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Link as RouterLink } from 'react-router-dom'
import { api } from '../services/api'
import type { Blog } from '../types/api'
import { useAuth } from '../context/useAuth'

export const ExplorePage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalElements, setTotalElements] = useState<number>(0)
  const PAGE_SIZE = 10

  const fetchBlogs = useCallback(async (pageNumber: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.getAllPublicBlogs(pageNumber, PAGE_SIZE)
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setBlogs(response.data)
          setTotalPages(Math.max(1, Math.ceil(response.data.length / PAGE_SIZE)))
          setTotalElements(response.data.length)
        } else if (response.data.content && Array.isArray(response.data.content)) {
          setBlogs(response.data.content)
          const pages = response.data.page?.totalPages ?? response.data.totalPages ?? 1
          const total =
            response.data.page?.totalElements ??
            response.data.totalElements ??
            response.data.content.length
          setTotalPages(Math.max(1, pages))
          setTotalElements(total)
        } else {
          setBlogs([])
          setTotalPages(1)
          setTotalElements(0)
        }
      } else {
        setBlogs([])
        setTotalPages(1)
        setTotalElements(0)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load stories. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlogs(page)
  }, [page, fetchBlogs])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
    } catch {
      return dateString
    }
  }

  const estimateReadTime = (text?: string) => {
    if (!text) return '1 min read'
    const words = text.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 180))
    return `${minutes} min read`
  }

  return (
    <Container maxWidth="lg">
      {/* Hero Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ maxWidth: 640 }}>
          <Chip
            label="InkFlow Journal"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.15,
            }}
          >
            Explore thought, narrative, and knowledge.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 3,
              fontSize: '1.1rem',
            }}
          >
            Discover published essays and perspectives from independent writers around the world.
          </Typography>
          {!isAuthenticated && (
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: '#ffffff',
                color: '#0f172a',
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#f1f5f9',
                },
              }}
            >
              Start Writing on InkFlow
            </Button>
          )}
        </Box>
      </Paper>

      {/* Header and Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Latest Published Stories
          </Typography>
          {!loading && !error && blogs.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {totalElements > blogs.length
                ? `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, totalElements)} of ${totalElements} published articles`
                : `Showing ${blogs.length} published article${blogs.length === 1 ? '' : 's'}`}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Error state */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchBlogs(page)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={36} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && !error && blogs.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px dashed #cbd5e1',
          }}
        >
          <AutoStoriesIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            No published stories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
            Be the first to share an article or story with readers on InkFlow!
          </Typography>
          {isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/create-blog"
              variant="contained"
              startIcon={<EditIcon />}
            >
              Write First Story
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
            >
              Sign In to Publish
            </Button>
          )}
        </Box>
      )}

      {/* Stories Grid */}
      {!loading && !error && blogs.length > 0 && (
        <>
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid key={blog.blogId} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(blog.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        •
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {estimateReadTime(blog.content)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        lineHeight: 1.35,
                        mb: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {blog.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {blog.content}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-start' }}>
                    <Button
                      component={RouterLink}
                      to={`/blogs/${blog.blogId}`}
                      size="small"
                      color="secondary"
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={{ fontWeight: 600, p: 0 }}
                    >
                      Read Story
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          {blogs.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mt: 6,
                mb: 4,
                p: { xs: 2, sm: 2.5 },
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<NavigateBeforeIcon />}
                onClick={handlePrevPage}
                disabled={page === 0 || loading}
                aria-label="Previous page"
                sx={{ fontWeight: 600, minWidth: 110 }}
              >
                Previous
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Pagination
                  count={Math.max(1, totalPages)}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="medium"
                  showFirstButton
                  showLastButton
                  disabled={loading}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Page {page + 1} of {Math.max(1, totalPages)}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="primary"
                endIcon={<NavigateNextIcon />}
                onClick={handleNextPage}
                disabled={page >= totalPages - 1 || loading}
                aria-label="Next page"
                sx={{ fontWeight: 600, minWidth: 110 }}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}
