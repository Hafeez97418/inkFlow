import { createContext } from 'react'
import type { UserDetailsResponse, AuthCredentials, UserRegistrationRequest } from '../types/api'

export interface AuthContextType {
  user: UserDetailsResponse | null
  credentials: AuthCredentials | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: AuthCredentials) => Promise<UserDetailsResponse>
  register: (payload: UserRegistrationRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
