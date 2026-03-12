import type { OrderStatus } from '@/types'

export const ORDER_STATUS_PIPELINE: OrderStatus[] = [
  'ORDER_RECEIVED',
  'QUOTE_SENT',
  'QUOTE_APPROVED',
  'DEPOSIT_RECEIVED',
  'IN_PRODUCTION',
  'QUALITY_CHECK',
  'READY_TO_SHIP',
  'SHIPPED',
  'DELIVERED',
]

export const STATUS_BADGE_VARIANT: Record<OrderStatus, 'info' | 'warning' | 'success' | 'primary' | 'danger'> = {
  ORDER_RECEIVED: 'info',
  QUOTE_SENT: 'warning',
  QUOTE_APPROVED: 'success',
  DEPOSIT_RECEIVED: 'success',
  IN_PRODUCTION: 'primary',
  QUALITY_CHECK: 'warning',
  READY_TO_SHIP: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
}

export const MIN_ORDER_QUANTITY = 10
