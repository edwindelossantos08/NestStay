export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  userName: string
  roles: string[]
  avatarUrl?: string
}

export interface AssignRoleRequest {
  role: string
}

export interface UserProfileResponse {
  id: number
  name: string
  email: string
  avatarUrl?: string
  roles: string[]
  createdAt: string
}

export interface UpdateProfileRequest {
  name: string
  avatarUrl?: string
}
