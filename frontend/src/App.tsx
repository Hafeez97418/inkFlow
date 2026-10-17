import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import { ExplorePage } from './pages/ExplorePage'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { MyBlogsPage } from './pages/MyBlogsPage'
import { CreateBlogPage } from './pages/CreateBlogPage'
import { EditBlogPage } from './pages/EditBlogPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<ExplorePage />} />
                <Route path="/blogs/:blogId" element={<BlogDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Author Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/my-blogs" element={<MyBlogsPage />} />
                  <Route path="/create-blog" element={<CreateBlogPage />} />
                  <Route path="/edit-blog/:blogId" element={<EditBlogPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Fallback 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
