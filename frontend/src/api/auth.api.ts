import apiClient from './axios'
import type { LoginRequest, LoginResponse, RegisterRequest, AssignRoleRequest } from '../types/auth.types'
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
}
