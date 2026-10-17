import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ExploreIcon from '@mui/icons-material/Explore'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useNotification } from '../context/useNotification'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { showInfo } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMenuOpen = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  const handleLogout = () => {
    handleCloseMenu()
    setMobileOpen(false)
    logout()
    showInfo('You have been signed out')
    navigate('/')
  }

  const getInitials = () => {
    if (!user) return '?'
    const first = user.firstName ? user.firstName[0].toUpperCase() : ''
    const last = user.lastname ? user.lastname[0].toUpperCase() : ''
    return `${first}${last}` || (user.email ? user.email[0].toUpperCase() : '?')
  }

  const navLinks = [
    { label: 'Explore', path: '/', icon: <ExploreIcon fontSize="small" /> },
    ...(isAuthenticated
      ? [
          { label: 'My Stories', path: '/my-blogs', icon: <BookmarksIcon fontSize="small" /> },
          { label: 'New Story', path: '/create-blog', icon: <EditIcon fontSize="small" /> },
          { label: 'Profile', path: '/profile', icon: <PersonIcon fontSize="small" /> },
        ]
      : []),
  ]

  const mobileDrawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          onClick={() => setMobileOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: 1.25 }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoStoriesIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>
            InkFlow
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileOpen(false)} size="small" aria-label="close menu">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* User Info if authenticated */}
      {isAuthenticated && (
        <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main', fontWeight: 700, fontSize: '0.9rem' }}>
              {getInitials()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.firstName} {user?.lastname}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Chip label="Author" size="small" color="default" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
        </Box>
      )}

      {/* Nav List */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  color: isActive ? 'secondary.main' : 'text.primary',
                  fontWeight: isActive ? 700 : 500,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'secondary.main' : 'text.secondary', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Drawer Bottom Actions */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        {isAuthenticated ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ fontWeight: 600 }}
          >
            Sign Out
          </Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
              onClick={() => setMobileOpen(false)}
              sx={{ fontWeight: 600 }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/register"
              startIcon={<PersonAddIcon />}
              onClick={() => setMobileOpen(false)}
              sx={{ fontWeight: 600 }}
            >
              Get Started
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64, justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoStoriesIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'primary.main',
                  display: 'block',
                  lineHeight: 1.1,
                }}
              >
                InkFlow
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Stories & Insights
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links (hidden on xs/sm, visible on md+) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: location.pathname === '/' ? 700 : 500,
                color: location.pathname === '/' ? 'secondary.main' : 'text.primary',
              }}
            >
              Explore
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/my-blogs"
                  startIcon={<BookmarksIcon fontSize="small" />}
                  sx={{
                    fontWeight: location.pathname === '/my-blogs' ? 700 : 500,
                    color: location.pathname === '/my-blogs' ? 'secondary.main' : 'text.primary',
                  }}
                >
                  My Stories
                </Button>

                <Button
                  component={RouterLink}
                  to="/create-blog"
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon fontSize="small" />}
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Write
                </Button>

                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenMenu} size="small" sx={{ ml: 1 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                      }}
                    >
                      {getInitials()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  onClick={handleCloseMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      elevation: 4,
                      sx: {
                        minWidth: 220,
                        borderRadius: 2,
                        mt: 1,
                        p: 0.5,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {user?.firstName} {user?.lastname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {user?.email}
                    </Typography>
                    <Chip label="Author" size="small" color="default" sx={{ mt: 1, height: 20, fontSize: '0.65rem' }} />
                  </Box>
                  <Divider />
                  <MenuItem component={RouterLink} to="/my-blogs">
                    <ListItemIcon>
                      <BookmarksIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Stories" />
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/profile">
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/create-blog">
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="New Story" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Navigation Controls (visible on xs/sm, hidden on md+) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            {isAuthenticated && (
              <Button
                component={RouterLink}
                to="/create-blog"
                variant="contained"
                color="primary"
                size="small"
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 4,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                Write
              </Button>
            )}

            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {mobileDrawer}
      </Drawer>
    </AppBar>
  )
}
