import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useOrder, useUpdateOrderStatus, useAddMessage } from '@/hooks/useOrders'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import { ORDER_STATUS_LABELS } from '@/types'
import type { OrderStatus } from '@/types'
import { STATUS_BADGE_VARIANT, ORDER_STATUS_PIPELINE } from '@/lib/constants'
import { format } from 'date-fns'
import { useToast } from '@/store/uiStore'

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id!)
  const updateStatus = useUpdateOrderStatus()
  const addMessage = useAddMessage()
  const toast = useToast()
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  if (isLoading) return <Spinner className="min-h-screen" />
  if (!order) return <PageWrapper title="Order not found"><p className="text-white/50">This order doesn't exist.</p></PageWrapper>

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return
    try {
      await updateStatus.mutateAsync({ id: order.id, status: selectedStatus as OrderStatus })
      toast.success('Status updated')
      setSelectedStatus('')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      await addMessage.mutateAsync({ orderId: order.id, content: newMessage, internal: isInternal })
      setNewMessage('')
      toast.success(isInternal ? 'Internal note added' : 'Message sent')
    } catch {
      toast.error('Failed to send message')
    }
  }

  return (
    <PageWrapper
      title={order.orderNumber}
      subtitle={`${order.customer?.name || order.customer?.email} — ${order.garmentType} (×${order.quantity})`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status update */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">Status</h3>
                <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Select
                  options={ORDER_STATUS_PIPELINE.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  placeholder="Update status..."
                />
              </div>
              <Button onClick={handleStatusUpdate} loading={updateStatus.isPending} disabled={!selectedStatus}>
                Update
              </Button>
            </div>
          </Card>

          {/* Order details */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Garment Type', order.garmentType],
                ['Quantity', order.quantity],
                ['Fabric', order.fabricType],
                ['Fabric Weight', order.fabricWeight],
                ['Colors', order.colorCodes],
                ['Logo Placement', order.logoPlacement],
                ['Decoration', order.decorationMethod],
                ['Labels', order.labelRequirements],
                ['Shipping Method', order.shippingMethod],
                ['Timeline', order.timelineRequest],
                ['Ordered', format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')],
              ].filter(([, v]) => v != null).map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-xs text-white/40 uppercase tracking-wider">{label}</dt>
                  <dd className="text-sm text-white mt-0.5">{String(value)}</dd>
                </div>
              ))}
            </dl>
            {order.specialNotes && (
              <div className="mt-4 pt-4 border-t border-smoke">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Special Notes</p>
                <p className="text-sm text-white">{order.specialNotes}</p>
              </div>
            )}
            {order.shippingAddress && (
              <div className="mt-4 pt-4 border-t border-smoke">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Shipping Address</p>
                <p className="text-sm text-white whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            )}
          </Card>

          {/* Messages */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Messages</h3>
            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
              {order.messages && order.messages.length > 0 ? (
                order.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.internal ? 'bg-amber/5 rounded-xl p-3 border border-amber/20' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center text-xs font-medium text-white/60 shrink-0">
                      {msg.author?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{msg.author?.name || 'Unknown'}</span>
                        {msg.internal && <Badge variant="warning">Internal</Badge>}
                        <span className="text-xs text-white/30">{format(new Date(msg.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{msg.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/40">No messages yet</p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={isInternal ? 'Add internal note...' : 'Type a message...'}
                  className="flex-1 rounded-xl bg-charcoal border border-smoke px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <Button size="sm" onClick={handleSendMessage} loading={addMessage.isPending}>
                  Send
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded border-smoke"
                />
                Internal note (admin only)
              </label>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer info */}
          <Card>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Customer</h3>
            <div className="space-y-2">
              <p className="text-white font-medium">{order.customer?.name || '—'}</p>
              <p className="text-sm text-white/50">{order.customer?.email}</p>
              {order.customer?.company && <p className="text-sm text-white/50">{order.customer.company}</p>}
            </div>
          </Card>

          {/* Files */}
          <Card>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Files</h3>
            {order.files && order.files.length > 0 ? (
              <div className="space-y-2">
                {order.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-smoke/30 rounded-lg hover:bg-smoke/50 transition-colors"
                  >
                    <span className="text-xs text-white truncate">{file.filename}</span>
                    <span className="text-[10px] text-white/30 ml-auto shrink-0">{file.type.replace('_', ' ')}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No files</p>
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
