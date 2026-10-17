import React, { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { UserDetailsResponse, AuthCredentials, UserRegistrationRequest } from '../types/api'
import { api, getStoredCredentials, setStoredCredentials } from '../services/api'
import { AuthContext } from './authContextDef'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDetailsResponse | null>(null)
  const [credentials, setCredentialsState] = useState<AuthCredentials | null>(() => getStoredCredentials())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshUser = useCallback(async () => {
    const creds = getStoredCredentials()
    if (!creds) {
      setUser(null)
      setCredentialsState(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await api.getUser(creds)
      if (response && response.data) {
        setUser(response.data)
        setCredentialsState(creds)
      } else {
        setUser(null)
        setCredentialsState(null)
        setStoredCredentials(null)
      }
    } catch {
      setUser(null)
      setCredentialsState(null)
      setStoredCredentials(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isSubscribed = true

    const checkStoredAuth = async () => {
      await Promise.resolve()
      if (!isSubscribed) return

      const creds = getStoredCredentials()
      if (!creds) {
        setUser(null)
        setCredentialsState(null)
        setIsLoading(false)
        return
      }

      try {
        const response = await api.getUser(creds)
        if (!isSubscribed) return
        if (response && response.data) {
          setUser(response.data)
          setCredentialsState(creds)
        } else {
          setUser(null)
          setCredentialsState(null)
          setStoredCredentials(null)
        }
      } catch {
        if (!isSubscribed) return
        setUser(null)
        setCredentialsState(null)
        setStoredCredentials(null)
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }

    void checkStoredAuth()

    return () => {
      isSubscribed = false
    }
  }, [])

  const login = async (creds: AuthCredentials): Promise<UserDetailsResponse> => {
    const res = await api.getUser(creds)
    const userDetails = res.data
    setStoredCredentials(creds)
    setCredentialsState(creds)
    setUser(userDetails)
    return userDetails
  }

  const register = async (payload: UserRegistrationRequest): Promise<void> => {
    await api.register(payload)
    await login({ email: payload.email, password: payload.password })
  }

  const logout = () => {
    setStoredCredentials(null)
    setCredentialsState(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        credentials,
        isAuthenticated: !!user && !!credentials,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
