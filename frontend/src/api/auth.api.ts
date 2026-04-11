import apiClient from './axios'
import type { LoginRequest, LoginResponse, RegisterRequest, AssignRoleRequest, UserProfileResponse, UpdateProfileRequest } from '../types/auth.types'
import type { ApiResponse } from '../types/api.types'

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<null>>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', data),

  confirmAccount: (token: string) =>
    apiClient.get<ApiResponse<null>>(`/api/auth/confirm-account?token=${token}`),

  assignRole: (data: AssignRoleRequest) =>
    apiClient.post<ApiResponse<null>>('/api/auth/assign-role', data),

  getProfile: () =>
    apiClient.get<ApiResponse<UserProfileResponse>>('/api/auth/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserProfileResponse>>('/api/auth/profile', data),
}
