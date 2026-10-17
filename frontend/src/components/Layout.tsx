import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export const Layout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
