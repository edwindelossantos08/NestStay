import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties.api'
import type { SearchPropertiesRequest } from '../types/property.types'

export const useSearchProperties = (params: SearchPropertiesRequest) =>
  useQuery({
    queryKey: ['properties', 'search', params],
    queryFn: () => propertiesApi.search(params).then((r) => r.data.data),
  })

export const useProperty = (id: number) =>
  useQuery({
    queryKey: ['properties', id],
    queryFn: () => propertiesApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  })

export const useMyProperties = () =>
  useQuery({
    queryKey: ['properties', 'mine'],
    queryFn: () => propertiesApi.getMyProperties().then((r) => r.data.data),
  })
