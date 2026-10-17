import React from 'react'
import { Container, Paper, Typography, Button, Box } from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import HomeIcon from '@mui/icons-material/Home'
import { Link as RouterLink } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <AutoStoriesIcon fontSize="medium" />
        </Box>

        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360, mx: 'auto' }}>
          The page or story you are looking for doesn&apos;t exist or might have been moved.
        </Typography>

        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          sx={{ fontWeight: 600, px: 3 }}
        >
          Return to Explore
        </Button>
      </Paper>
    </Container>
  )
}
