import React, { useEffect, useState, useCallback } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Skeleton,
  Alert,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { api } from '../services/api'
import type { Blog } from '../types/api'
import { useAuth } from '../context/useAuth'
import { useNotification } from '../context/useNotification'

export const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showSuccess, showError } = useNotification()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const loadBlog = useCallback(async () => {
    if (!blogId) return
    setLoading(true)
    setError(null)
    try {
      // First attempt to fetch as public blog
      const res = await api.getSinglePublicBlog(blogId)
      if (res && res.data) {
        setBlog(res.data)
      } else {
        setError('Blog post not found')
      }
    } catch {
      // If public fetch failed (e.g. 404 because it's unpublished) and user is authenticated, check if it's user's own blog
      if (isAuthenticated) {
        try {
          const myRes = await api.getMySingleBlog(blogId)
          if (myRes && myRes.data) {
            setBlog(myRes.data)
            setIsOwner(true)
            setLoading(false)
            return
          }
        } catch {
          // Both failed
        }
      }
      setError('Story not found or you do not have permission to view it.')
    } finally {
      setLoading(false)
    }
  }, [blogId, isAuthenticated])

  useEffect(() => {
    loadBlog()
  }, [loadBlog])

  // Check if current user is owner by checking if this blog appears in user's blogs
  useEffect(() => {
    if (isAuthenticated && blog && !isOwner) {
      api.getMyBlogs().then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          const found = res.data.some((b) => String(b.blogId) === String(blog.blogId))
          if (found) {
            setIsOwner(true)
          }
        }
      }).catch(() => {
        // Ignore check errors
      })
    }
  }, [isAuthenticated, blog, isOwner])

  const handleTogglePublish = async () => {
    if (!blog) return
    setActionLoading(true)
    try {
      const nextStatus = !blog.published
      await api.publishMyBlog(blog.blogId, nextStatus)
      showSuccess(nextStatus ? 'Story published successfully!' : 'Story reverted to draft.')
      setBlog({ ...blog, published: nextStatus })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update publication status'
      showError(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!blog) return
    setActionLoading(true)
    try {
      await api.deleteBlog(blog.blogId)
      showSuccess('Story deleted successfully.')
      setDeleteDialogOpen(false)
      navigate('/my-blogs')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete story'
      showError(msg)
      setActionLoading(false)
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
            month: 'long',
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
    <Container maxWidth="md">
      {/* Back button */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          color="inherit"
          sx={{ fontWeight: 600, color: 'text.secondary' }}
        >
          Back
        </Button>
      </Box>

      {/* Loading state */}
      {loading && (
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 4 }} />
          <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
        </Paper>
      )}

      {/* Error state */}
      {!loading && error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={loadBlog}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Story Content */}
      {!loading && blog && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: 'background.paper',
          }}
        >
          {/* Metadata bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label={blog.published ? 'Published' : 'Draft'}
                size="small"
                color={blog.published ? 'success' : 'default'}
                variant={blog.published ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(blog.createdAt)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {estimateReadTime(blog.content)}
                </Typography>
              </Box>
            </Box>

            {/* Author Action controls */}
            {isOwner && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color={blog.published ? 'warning' : 'success'}
                  startIcon={blog.published ? <UnpublishedIcon /> : <PublishIcon />}
                  disabled={actionLoading}
                  onClick={handleTogglePublish}
                >
                  {blog.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  component={RouterLink}
                  to={`/edit-blog/${blog.blogId}`}
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.85rem', sm: '2.5rem' },
              lineHeight: 1.25,
              color: 'text.primary',
              mb: 4,
            }}
          >
            {blog.title}
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Content Body */}
          <Box
            sx={{
              typography: 'body1',
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: '#334155',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {blog.content}
          </Box>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete this story?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to permanently delete &quot;{blog?.title}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
