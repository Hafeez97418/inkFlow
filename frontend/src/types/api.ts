/**
 * API Type Definitions for InkFlow
 * Generated based on api_spec.json and backend responses
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
  timestamp: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface UserDetailsResponse {
  email: string;
  firstName: string;
  lastname: string;
}

export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;
  LastName?: string;
  email: string;
  password: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Blog {
  blogId: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  number?: number;
  size?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  page?: PageMetadata;
}

export interface BlogCreationRequest {
  title: string;
  content: string;
  published?: boolean;
}

export interface BlogUpdateRequest {
  title: string;
  content: string;
  published?: boolean;
}
