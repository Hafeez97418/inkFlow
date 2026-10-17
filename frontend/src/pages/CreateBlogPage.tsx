import React, { useState } from 'react'
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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import PublishIcon from '@mui/icons-material/Publish'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useNotification } from '../context/useNotification'

export const CreateBlogPage: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess } = useNotification()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (publishImmediately: boolean) => {
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
      const response = await api.createBlog({
        title: cleanTitle,
        content: cleanContent,
        published: publishImmediately,
      })
      showSuccess(publishImmediately ? 'Story created and published!' : 'Draft saved successfully!')
      if (response && response.data && response.data.blogId) {
        navigate(`/blogs/${response.data.blogId}`)
      } else {
        navigate('/my-blogs')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save story. Please try again.'
      setError(msg)
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
          Write a New Story
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Draft your thoughts or publish directly to the InkFlow community
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" noValidate>
          <TextField
            label="Story Title"
            required
            fullWidth
            placeholder="e.g. Architectural Patterns for Modern Web Apps"
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
            placeholder="Tell your story... You can format with paragraphs and clean text."
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
                    {published ? 'Will be published immediately' : 'Save as private draft'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {published ? 'Visible to everyone on the Explore feed' : 'Only visible to you'}
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
                variant="contained"
                color={published ? 'success' : 'primary'}
                startIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : published ? (
                    <PublishIcon />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={submitting}
                onClick={() => handleSubmit(published)}
                sx={{ px: 3, fontWeight: 700 }}
              >
                {submitting ? 'Saving...' : published ? 'Publish Story' : 'Save Draft'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
