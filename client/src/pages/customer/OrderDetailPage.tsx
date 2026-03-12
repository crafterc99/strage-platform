import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useOrder, useAddMessage } from '@/hooks/useOrders'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ORDER_STATUS_LABELS } from '@/types'
import { ORDER_STATUS_PIPELINE } from '@/lib/constants'
import { format } from 'date-fns'
import { useToast } from '@/store/uiStore'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id!)
  const addMessage = useAddMessage()
  const toast = useToast()
  const [newMessage, setNewMessage] = useState('')

  if (isLoading) return <Spinner className="min-h-screen" />
  if (!order) return <PageWrapper title="Order not found"><p className="text-white/50">This order doesn't exist.</p></PageWrapper>

  const statusIndex = ORDER_STATUS_PIPELINE.indexOf(order.status)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      await addMessage.mutateAsync({ orderId: order.id, content: newMessage })
      setNewMessage('')
      toast.success('Message sent')
    } catch {
      toast.error('Failed to send message')
    }
  }

  return (
    <PageWrapper title={order.orderNumber} subtitle={`${order.garmentType} — Qty ${order.quantity}`}>
      {/* Status pipeline */}
      <Card className="mb-6">
        <h3 className="text-sm font-medium text-white/70 mb-4">Order Progress</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {ORDER_STATUS_PIPELINE.map((status, i) => (
            <div key={status} className="flex items-center">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                i <= statusIndex ? 'bg-forest/20 text-emerald' : 'bg-smoke/50 text-white/30'
              }`}>
                {ORDER_STATUS_LABELS[status]}
              </div>
              {i < ORDER_STATUS_PIPELINE.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 ${i < statusIndex ? 'bg-forest' : 'bg-smoke'}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order details */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
          <dl className="space-y-3">
            {[
              ['Status', ORDER_STATUS_LABELS[order.status]],
              ['Garment Type', order.garmentType],
              ['Quantity', order.quantity],
              ['Fabric', order.fabricType],
              ['Fabric Weight', order.fabricWeight],
              ['Colors', order.colorCodes],
              ['Logo Placement', order.logoPlacement],
              ['Decoration', order.decorationMethod],
              ['Labels', order.labelRequirements],
              ['Shipping', order.shippingMethod],
              ['Timeline', order.timelineRequest],
              ['Placed', format(new Date(order.createdAt), 'MMM d, yyyy')],
            ].filter(([, v]) => v != null).map(([label, value]) => (
              <div key={String(label)} className="flex justify-between">
                <dt className="text-sm text-white/50">{label}</dt>
                <dd className="text-sm text-white font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
          {order.specialNotes && (
            <div className="mt-4 pt-4 border-t border-smoke">
              <p className="text-sm text-white/50 mb-1">Special Notes</p>
              <p className="text-sm text-white">{order.specialNotes}</p>
            </div>
          )}
        </Card>

        {/* Files */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Files</h3>
          {order.files && order.files.length > 0 ? (
            <div className="space-y-2">
              {order.files.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-smoke/30 rounded-xl hover:bg-smoke/50 transition-colors"
                >
                  <span className="text-sm text-white">{file.filename}</span>
                  <span className="text-xs text-white/30 ml-auto">{file.type.replace('_', ' ')}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">No files uploaded yet</p>
          )}
        </Card>
      </div>

      {/* Messages */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Messages</h3>
        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {order.messages && order.messages.length > 0 ? (
            order.messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center text-xs font-medium text-white/60 shrink-0">
                  {msg.author?.name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{msg.author?.name || 'Unknown'}</span>
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
        <div className="flex gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl bg-charcoal border border-smoke px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-forest"
          />
          <Button size="sm" onClick={handleSendMessage} loading={addMessage.isPending}>
            Send
          </Button>
        </div>
      </Card>
    </PageWrapper>
  )
}
