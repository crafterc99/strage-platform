export type Role = 'ADMIN' | 'CUSTOMER'

export type OrderStatus =
  | 'ORDER_RECEIVED'
  | 'QUOTE_SENT'
  | 'QUOTE_APPROVED'
  | 'DEPOSIT_RECEIVED'
  | 'IN_PRODUCTION'
  | 'QUALITY_CHECK'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'

export type FileType =
  | 'TECH_PACK'
  | 'REFERENCE_IMAGE'
  | 'MOCKUP'
  | 'PRODUCTION_PHOTO'
  | 'QC_PHOTO'
  | 'SHIPPING_DOC'
  | 'OTHER'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: 'Order Received',
  QUOTE_SENT: 'Quote Sent',
  QUOTE_APPROVED: 'Quote Approved',
  DEPOSIT_RECEIVED: 'Deposit Received',
  IN_PRODUCTION: 'In Production',
  QUALITY_CHECK: 'Quality Check',
  READY_TO_SHIP: 'Ready to Ship',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
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

export const GARMENT_TYPES = [
  'Jersey',
  'Tracksuit',
  'Hoodie',
  'Jacket',
  'Shorts',
  'Polo Shirt',
  'T-Shirt',
  'Custom',
] as const

export const DECORATION_METHODS = [
  'Sublimation',
  'Embroidery',
  'Screen Print',
  'DTG (Direct to Garment)',
  'Heat Transfer',
] as const

export const SHIPPING_METHODS = [
  'DHL Express',
  'FedEx International',
  'Sea Freight',
  'Air Freight',
  'Customer Arranged',
] as const

export interface User {
  id: string
  clerkId: string
  email: string
  name: string | null
  company: string | null
  role: Role
  phone: string | null
  address: string | null
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  garmentType: string
  quantity: number
  fabricType: string | null
  fabricWeight: string | null
  colorCodes: string | null
  logoPlacement: string | null
  decorationMethod: string | null
  labelRequirements: string | null
  shippingAddress: string | null
  shippingMethod: string | null
  specialNotes: string | null
  timelineRequest: string | null
  customerId: string
  customer?: Pick<User, 'name' | 'email' | 'company'>
  assignedToId: string | null
  files?: FileRecord[]
  messages?: Message[]
  createdAt: string
  updatedAt: string
}

export interface FileRecord {
  id: string
  filename: string
  url: string
  type: FileType
  orderId: string
  uploadedBy: string
  createdAt: string
}

export interface Message {
  id: string
  content: string
  orderId: string
  authorId: string
  author?: Pick<User, 'name' | 'role'>
  internal: boolean
  createdAt: string
}
