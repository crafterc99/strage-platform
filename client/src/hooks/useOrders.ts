import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Order, OrderStatus } from '@/types'
import { MOCK_ORDERS } from '@/lib/mockData'

const isPreviewMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => isPreviewMode ? Promise.resolve(MOCK_ORDERS) : api.get<Order[]>('/api/orders'),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => {
      if (isPreviewMode) {
        const order = MOCK_ORDERS.find((o) => o.id === id)
        return Promise.resolve(order || MOCK_ORDERS[0])
      }
      return api.get<Order>(`/api/orders/${id}`)
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Order>) => {
      if (isPreviewMode) {
        const order: Order = {
          id: `demo-${Date.now()}`,
          orderNumber: `STR-2026-${String(MOCK_ORDERS.length + 1).padStart(4, '0')}`,
          status: 'ORDER_RECEIVED',
          garmentType: data.garmentType || 'Custom',
          quantity: data.quantity || 10,
          fabricType: data.fabricType || null,
          fabricWeight: data.fabricWeight || null,
          colorCodes: data.colorCodes || null,
          logoPlacement: data.logoPlacement || null,
          decorationMethod: data.decorationMethod || null,
          labelRequirements: data.labelRequirements || null,
          shippingAddress: data.shippingAddress || null,
          shippingMethod: data.shippingMethod || null,
          specialNotes: data.specialNotes || null,
          timelineRequest: data.timelineRequest || null,
          customerId: 'preview-user',
          assignedToId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        MOCK_ORDERS.unshift(order)
        return Promise.resolve(order)
      }
      return api.post<Order>('/api/orders', data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => {
      if (isPreviewMode) {
        const order = MOCK_ORDERS.find((o) => o.id === id)
        if (order) order.status = status
        return Promise.resolve(order as Order)
      }
      return api.patch<Order>(`/api/orders/${id}/status`, { status })
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', id] })
    },
  })
}

export function useAddMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, content, internal }: { orderId: string; content: string; internal?: boolean }) => {
      if (isPreviewMode) {
        const order = MOCK_ORDERS.find((o) => o.id === orderId)
        const msg = {
          id: `msg-${Date.now()}`,
          content,
          orderId,
          authorId: 'preview-user',
          author: { name: internal ? 'Admin' : 'You', role: internal ? 'ADMIN' as const : 'CUSTOMER' as const },
          internal: internal || false,
          createdAt: new Date().toISOString(),
        }
        order?.messages?.push(msg)
        return Promise.resolve(msg)
      }
      return api.post(`/api/orders/${orderId}/messages`, { content, internal })
    },
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
    },
  })
}
