import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { ORDER_STATUS_LABELS } from '@/types'
import { STATUS_BADGE_VARIANT, ORDER_STATUS_PIPELINE } from '@/lib/constants'
import { format } from 'date-fns'

export default function OrderListPage() {
  const { data: orders, isLoading } = useOrders()
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!orders) return []
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q) ||
          o.customer?.company?.toLowerCase().includes(q) ||
          o.garmentType.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [orders, statusFilter, search])

  return (
    <PageWrapper title="Orders" subtitle={`${filtered.length} order${filtered.length !== 1 ? 's' : ''}`}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="w-full sm:w-64">
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              ...ORDER_STATUS_PIPELINE.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] })),
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner className="py-20" />
      ) : filtered.length > 0 ? (
        <div className="bg-graphite border border-smoke rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-smoke">
                <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Order #</th>
                <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Garment</th>
                <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Qty</th>
                <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-smoke/50 hover:bg-smoke/20 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order.id}`} className="text-sm font-medium text-forest hover:text-emerald">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{order.customer?.name || '—'}</div>
                    <div className="text-xs text-white/40">{order.customer?.company}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{order.garmentType}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{order.quantity}</td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/50">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <p className="text-center text-white/50 py-8">No orders match your filters</p>
        </Card>
      )}
    </PageWrapper>
  )
}
