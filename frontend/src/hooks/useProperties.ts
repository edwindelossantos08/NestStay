import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties.api'
import type {
  SearchPropertiesRequest,
  UpdatePropertyRequest,
} from '../types/property.types'

export const useSearchProperties = (params: SearchPropertiesRequest) =>
  useQuery({
    queryKey: ['properties', 'search', params],
    queryFn: () => propertiesApi.search(params).then((r) => r.data.data),
    staleTime: 1000 * 30,
  })

export const usePropertyById = (id: number) =>
  useQuery({
    queryKey: ['properties', id],
    queryFn: () => propertiesApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  })

// Alias mantenido para compatibilidad con páginas del host existentes
export const useProperty = usePropertyById

export const usePropertyReviews = (id: number) =>
  useQuery({
    queryKey: ['properties', id, 'reviews'],
    queryFn: () => propertiesApi.getReviews(id).then((r) => r.data.data),
    enabled: !!id,
  })

export const usePropertyAvailability = (
  id: number,
  year: number,
  month: number
) =>
  useQuery({
    queryKey: ['properties', id, 'availability', year, month],
    queryFn: () =>
      propertiesApi.getAvailability(id, year, month).then((r) => r.data.data),
    enabled: !!id,
  })

export const useMyProperties = () =>
  useQuery({
    queryKey: ['my-properties'],
    queryFn: () => propertiesApi.getMyProperties().then((r) => r.data.data),
  })

export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: propertiesApi.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['my-properties'] }),
  })
}

export const useUpdateProperty = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePropertyRequest) =>
      propertiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] })
      queryClient.invalidateQueries({ queryKey: ['properties', id] })
    },
  })
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: propertiesApi.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['my-properties'] }),
  })
}

export const useBlockDates = (propertyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dates: string[]) => propertiesApi.blockDates(propertyId, dates),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['properties', propertyId, 'availability'],
      }),
  })
}

export const useUnblockDates = (propertyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dates: string[]) =>
      propertiesApi.unblockDates(propertyId, dates),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['properties', propertyId, 'availability'],
      }),
  })
}
