import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Tabs,
  Tab,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import AddIcon from '@mui/icons-material/Add'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import type { Blog } from '../types/api'
import { useNotification } from '../context/useNotification'

export const MyBlogsPage: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [tabIndex, setTabIndex] = useState<number>(0)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)

  // Toggling publish state
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const fetchMyBlogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.getMyBlogs()
      if (response && response.data && Array.isArray(response.data)) {
        setBlogs(response.data)
      } else {
        setBlogs([])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch your stories'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMyBlogs()
  }, [fetchMyBlogs])

  const handleTogglePublish = async (blog: Blog) => {
    setTogglingId(blog.blogId)
    const nextStatus = !blog.published
    try {
      await api.publishMyBlog(blog.blogId, nextStatus)
      showSuccess(nextStatus ? 'Story published!' : 'Story unpublished.')
      setBlogs((prev) =>
        prev.map((b) => (b.blogId === blog.blogId ? { ...b, published: nextStatus } : b))
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update publication status'
      showError(msg)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.deleteBlog(deleteTarget.blogId)
      showSuccess('Story removed.')
      setBlogs((prev) => prev.filter((b) => b.blogId !== deleteTarget.blogId))
      setDeleteTarget(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete story'
      showError(msg)
    } finally {
      setDeleting(false)
    }
  }

  const filteredBlogs = useMemo(() => {
    if (tabIndex === 1) return blogs.filter((b) => b.published)
    if (tabIndex === 2) return blogs.filter((b) => !b.published)
    return blogs
  }, [blogs, tabIndex])

  const publishedCount = useMemo(() => blogs.filter((b) => b.published).length, [blogs])
  const draftsCount = useMemo(() => blogs.filter((b) => !b.published).length, [blogs])

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

  return (
    <Container maxWidth="lg">
      {/* Page Title & Action Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            My Stories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your drafts, published articles, and audience visibility
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/create-blog"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ fontWeight: 600, px: 2.5 }}
        >
          Write New Story
        </Button>
      </Box>

      {/* Tabs Filter */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_e, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={`All (${blogs.length})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Published (${publishedCount})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Drafts (${draftsCount})`} sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Error state */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={fetchMyBlogs}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Card key={i} sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="20%" height={28} />
            </Card>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBlogs.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px dashed #cbd5e1',
          }}
        >
          <AutoStoriesIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            {tabIndex === 0
              ? "You haven't written any stories yet"
              : tabIndex === 1
              ? 'No published stories found'
              : 'No drafts found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
            Share your thoughts, tutorials, and reflections with readers on InkFlow.
          </Typography>
          <Button
            component={RouterLink}
            to="/create-blog"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Your First Story
          </Button>
        </Box>
      )}

      {/* Blogs List */}
      {!loading && !error && filteredBlogs.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {filteredBlogs.map((blog) => (
            <Card
              key={blog.blogId}
              sx={{
                p: { xs: 2, sm: 2.5 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
                transition: 'border-color 0.15s ease',
                '&:hover': {
                  borderColor: 'primary.light',
                },
              }}
            >
              <CardContent sx={{ p: '0 !important', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Chip
                    label={blog.published ? 'Published' : 'Draft'}
                    size="small"
                    color={blog.published ? 'success' : 'default'}
                    variant={blog.published ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600, height: 22, fontSize: '0.72rem' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(blog.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    mb: 0.75,
                    cursor: 'pointer',
                    '&:hover': { color: 'secondary.main' },
                  }}
                  onClick={() => navigate(`/blogs/${blog.blogId}`)}
                >
                  {blog.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.6,
                  }}
                >
                  {blog.content}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: '0 !important', gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title={blog.published ? 'Unpublish story' : 'Publish to readers'}>
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      color={blog.published ? 'warning' : 'success'}
                      startIcon={blog.published ? <UnpublishedIcon /> : <PublishIcon />}
                      disabled={togglingId === blog.blogId}
                      onClick={() => handleTogglePublish(blog)}
                      sx={{ minWidth: 110 }}
                    >
                      {blog.published ? 'Unpublish' : 'Publish'}
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title="View story">
                  <IconButton
                    size="small"
                    component={RouterLink}
                    to={`/blogs/${blog.blogId}`}
                    color="primary"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit story">
                  <IconButton
                    size="small"
                    component={RouterLink}
                    to={`/edit-blog/${blog.blogId}`}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete story">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteTarget(blog)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Story</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
