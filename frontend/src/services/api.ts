import type {
  ApiResponse,
  UserDetailsResponse,
  UserRegistrationRequest,
  AuthCredentials,
  Blog,
  PageResponse,
  BlogCreationRequest,
  BlogUpdateRequest,
} from '../types/api'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const AUTH_STORAGE_KEY = 'inkflow_auth_credentials'

/**
 * Storage helpers for basic auth credentials
 */
export function getStoredCredentials(): AuthCredentials | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthCredentials
  } catch {
    return null
  }
}

export function setStoredCredentials(credentials: AuthCredentials | null): void {
  try {
    if (credentials) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Helper to build basic auth header
 */
function getAuthHeader(credentials?: AuthCredentials | null): Record<string, string> {
  const creds = credentials || getStoredCredentials()
  if (!creds || !creds.email || !creds.password) {
    return {}
  }
  const token = btoa(`${creds.email}:${creds.password}`)
  return {
    Authorization: `Basic ${token}`,
  }
}

/**
 * Unified fetch wrapper
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  credentials?: AuthCredentials | null
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const authHeaders = getAuthHeader(credentials)
  for (const [key, val] of Object.entries(authHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, val)
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let responseData: unknown
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }
  } else {
    try {
      const text = await response.text()
      responseData = text ? { message: text } : null
    } catch {
      responseData = null
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    if (responseData && typeof responseData === 'object') {
      const record = responseData as Record<string, unknown>
      if (typeof record.message === 'string' && record.message) {
        errorMessage = record.message
      } else if (typeof record.error === 'string' && record.error) {
        errorMessage = record.error
      }
    }
    throw new Error(errorMessage)
  }

  return responseData as ApiResponse<T>
}

export const api = {
  /**
   * Register a new user account
   */
  async register(data: UserRegistrationRequest): Promise<ApiResponse<string>> {
    return request<string>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        LastName: data.lastName, // API spec compatibility
        email: data.email,
        password: data.password,
      }),
    })
  },

  /**
   * Retrieve current user profile details
   */
  async getUser(credentials?: AuthCredentials): Promise<ApiResponse<UserDetailsResponse>> {
    try {
      return await request<UserDetailsResponse>('/api/v1/user', { method: 'GET' }, credentials)
    } catch (err: unknown) {
      // Fallback to '/' if the server maps getUser directly at root per api_spec.json
      if (err instanceof Error && err.message.includes('404')) {
        return await request<UserDetailsResponse>('/', { method: 'GET' }, credentials)
      }
      throw err
    }
  },

  /**
   * List all publicly published blogs with pagination
   */
  async getAllPublicBlogs(page: number = 0, limit: number = 10): Promise<ApiResponse<PageResponse<Blog>>> {
    return request<PageResponse<Blog>>(`/api/v1/blogs?page=${page}&limit=${limit}`, {
      method: 'GET',
    })
  },

  /**
   * Fetch a single publicly visible blog post
   */
  async getSinglePublicBlog(blogId: number | string): Promise<ApiResponse<Blog>> {
    return request<Blog>(`/api/v1/blogs/${blogId}`, {
      method: 'GET',
    })
  },

  /**
   * Fetch all blog posts belonging to the authenticated user
   */
  async getMyBlogs(): Promise<ApiResponse<Blog[]>> {
    return request<Blog[]>('/api/v1/blogs/me', {
      method: 'GET',
    })
  },

  /**
   * Retrieve a specific blog post by ID for the authenticated user
   */
  async getMySingleBlog(blogId: number | string): Promise<ApiResponse<Blog>> {
    return request<Blog>(`/api/v1/blogs/me/${blogId}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new draft or published blog post
   */
  async createBlog(payload: BlogCreationRequest): Promise<ApiResponse<Blog>> {
    return request<Blog>('/api/v1/blogs', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        content: payload.content,
        published: payload.published ?? false,
      }),
    })
  },

  /**
   * Update the title and content of an existing blog post
   */
  async updateBlog(blogId: number | string, payload: BlogUpdateRequest): Promise<ApiResponse<Blog>> {
    return request<Blog>(`/api/v1/blogs/${blogId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: payload.title,
        content: payload.content,
        ...(payload.published !== undefined ? { published: payload.published } : {}),
      }),
    })
  },

  /**
   * Toggle the published/unpublished state of a blog post
   */
  async publishMyBlog(blogId: number | string, flag: boolean): Promise<ApiResponse<boolean>> {
    return request<boolean>(`/api/v1/blogs/publish/${blogId}?flag=${flag}`, {
      method: 'PATCH',
    })
  },

  /**
   * Remove a blog post
   */
  async deleteBlog(blogId: number | string): Promise<ApiResponse<boolean>> {
    return request<boolean>(`/api/v1/blogs/${blogId}`, {
      method: 'DELETE',
    })
  },
}
