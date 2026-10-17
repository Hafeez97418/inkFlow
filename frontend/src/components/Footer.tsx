import React from 'react'
import { Box, Container, Typography, Link } from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { Link as RouterLink } from 'react-router-dom'

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        mt: 'auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoStoriesIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              InkFlow Platform
            </Typography>
            <Typography variant="caption" color="text.secondary">
              — A modern writing & reading space
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link component={RouterLink} to="/" variant="body2" color="text.secondary" underline="hover">
              Explore
            </Link>
            <Link component={RouterLink} to="/my-blogs" variant="body2" color="text.secondary" underline="hover">
              My Stories
            </Link>
            <Link component={RouterLink} to="/create-blog" variant="body2" color="text.secondary" underline="hover">
              Write
            </Link>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} InkFlow. Powered by React, Vite, TypeScript & Material UI.
        </Typography>
      </Container>
    </Box>
  )
}
