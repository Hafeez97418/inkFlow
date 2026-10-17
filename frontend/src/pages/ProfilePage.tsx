import React, { useEffect, useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import PublishIcon from '@mui/icons-material/Publish'
import EditIcon from '@mui/icons-material/Edit'
import ShieldIcon from '@mui/icons-material/Shield'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { api } from '../services/api'
import type { Blog } from '../types/api'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMyBlogs().then((res) => {
      if (res && res.data && Array.isArray(res.data)) {
        setBlogs(res.data)
      }
    }).catch(() => {
      // Ignore
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const publishedCount = blogs.filter((b) => b.published).length
  const draftsCount = blogs.filter((b) => !b.published).length

  const getInitials = () => {
    if (!user) return '?'
    const first = user.firstName ? user.firstName[0].toUpperCase() : ''
    const last = user.lastname ? user.lastname[0].toUpperCase() : ''
    return `${first}${last}` || user.email[0].toUpperCase()
  }

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 800,
            }}
          >
            {getInitials()}
          </Avatar>

          <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                {user?.firstName} {user?.lastname}
              </Typography>
              <Chip label="Author" color="primary" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                mt: 1,
                color: 'text.secondary',
              }}
            >
              <EmailIcon fontSize="small" />
              <Typography variant="body1">{user?.email}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                mt: 0.5,
                color: 'success.main',
              }}
            >
              <ShieldIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Authenticated via HTTP Basic Authentication
              </Typography>
            </Box>
          </Box>

          <Button
            component={RouterLink}
            to="/create-blog"
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ fontWeight: 600 }}
          >
            Write Story
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Author Statistics
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <BookmarksIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {blogs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Stories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <PublishIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {publishedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <EditIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                    {draftsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drafts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button component={RouterLink} to="/my-blogs" variant="outlined" color="primary">
            View All in My Stories
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
