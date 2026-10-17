import React, { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
  Skeleton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useNotification } from '../context/useNotification'

export const EditBlogPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [initialPublished, setInitialPublished] = useState(false)
  const [published, setPublished] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStory = useCallback(async () => {
    if (!blogId) return
    setFetching(true)
    setError(null)
    try {
      const response = await api.getMySingleBlog(blogId)
      if (response && response.data) {
        setTitle(response.data.title || '')
        setContent(response.data.content || '')
        setInitialPublished(!!response.data.published)
        setPublished(!!response.data.published)
      } else {
        setError('Story not found')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch story details'
      setError(msg)
    } finally {
      setFetching(false)
    }
  }, [blogId])

  useEffect(() => {
    loadStory()
  }, [loadStory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blogId) return
    setError(null)

    const cleanTitle = title.trim()
    const cleanContent = content.trim()

    if (!cleanTitle) {
      setError('Story title is required.')
      return
    }
    if (cleanTitle.length > 255) {
      setError('Title cannot exceed 255 characters.')
      return
    }
    if (!cleanContent) {
      setError('Story content is required.')
      return
    }

    setSubmitting(true)
    try {
      // 1. Update title and content
      await api.updateBlog(blogId, {
        title: cleanTitle,
        content: cleanContent,
      })

      // 2. If publication flag was changed, toggle publication state
      if (published !== initialPublished) {
        await api.publishMyBlog(blogId, published)
      }

      showSuccess('Story updated successfully!')
      navigate(`/blogs/${blogId}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update story'
      setError(msg)
      showError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/my-blogs')}
          color="inherit"
          sx={{ fontWeight: 600, color: 'text.secondary' }}
        >
          Back to My Stories
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Edit Story
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update the content and publication visibility of your article
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {fetching ? (
          <Box sx={{ py: 3 }}>
            <Skeleton variant="text" width="50%" height={48} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Story Title"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              helperText={`${title.length}/255 characters`}
              slotProps={{
                htmlInput: {
                  maxLength: 255,
                },
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Content"
              required
              fullWidth
              multiline
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    color="primary"
                    disabled={submitting}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {published ? 'Published to Public Feed' : 'Saved as Private Draft'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {published ? 'Anyone can read this article' : 'Only visible in your dashboard'}
                    </Typography>
                  </Box>
                }
              />

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/my-blogs')}
                  disabled={submitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={
                    submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />
                  }
                  disabled={submitting}
                  sx={{ px: 3, fontWeight: 700 }}
                >
                  {submitting ? 'Updating...' : 'Update Story'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  )
}
