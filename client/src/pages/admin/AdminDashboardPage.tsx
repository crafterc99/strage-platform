import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { ORDER_STATUS_LABELS } from '@/types'
import { STATUS_BADGE_VARIANT } from '@/lib/constants'
import { format } from 'date-fns'

export default function AdminDashboardPage() {
  const { data: orders, isLoading } = useOrders()

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === 'ORDER_RECEIVED' || o.status === 'QUOTE_SENT').length || 0,
    inProduction: orders?.filter((o) => o.status === 'IN_PRODUCTION' || o.status === 'QUALITY_CHECK').length || 0,
    completed: orders?.filter((o) => o.status === 'DELIVERED').length || 0,
  }

  return (
    <PageWrapper title="Admin Dashboard" subtitle="Overview of all operations">
      {isLoading ? (
        <Spinner className="py-20" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <p className="text-sm text-white/50">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </Card>
            <Card>
              <p className="text-sm text-white/50">Pending</p>
              <p className="text-3xl font-bold text-amber mt-1">{stats.pending}</p>
            </Card>
            <Card>
              <p className="text-sm text-white/50">In Production</p>
              <p className="text-3xl font-bold text-emerald mt-1">{stats.inProduction}</p>
            </Card>
            <Card>
              <p className="text-sm text-white/50">Completed</p>
              <p className="text-3xl font-bold text-white/60 mt-1">{stats.completed}</p>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-forest hover:text-emerald transition-colors">
              View All
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="bg-graphite border border-smoke rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-smoke">
                    <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Order #</th>
                    <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Garment</th>
                    <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-smoke/50 hover:bg-smoke/20 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order.id}`} className="text-sm font-medium text-forest hover:text-emerald">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">{order.customer?.name || order.customer?.email || '—'}</td>
                      <td className="px-6 py-4 text-sm text-white/70">{order.garmentType} (×{order.quantity})</td>
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
              <p className="text-center text-white/50 py-8">No orders yet</p>
            </Card>
          )}
        </>
      )}
    </PageWrapper>
  )
}
