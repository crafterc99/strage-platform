import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ORDER_STATUS_LABELS } from '@/types'
import { STATUS_BADGE_VARIANT } from '@/lib/constants'

export default function PortalPage() {
  const { data: orders, isLoading } = useOrders()

  const activeOrders = orders?.filter((o) => o.status !== 'DELIVERED') || []
  const completedOrders = orders?.filter((o) => o.status === 'DELIVERED') || []

  return (
    <PageWrapper
      title="Welcome back"
      subtitle="Manage your orders and track production progress"
      action={
        <Link to="/portal/orders/new">
          <Button>New Order</Button>
        </Link>
      }
    >
      {isLoading ? (
        <Spinner className="py-20" />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <p className="text-sm text-white/50">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{orders?.length || 0}</p>
            </Card>
            <Card>
              <p className="text-sm text-white/50">Active</p>
              <p className="text-3xl font-bold text-emerald mt-1">{activeOrders.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-white/50">Completed</p>
              <p className="text-3xl font-bold text-white/60 mt-1">{completedOrders.length}</p>
            </Card>
          </div>

          {/* Recent orders */}
          <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
          {orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link key={order.id} to={`/portal/orders/${order.id}`}>
                  <Card hover className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{order.orderNumber}</p>
                      <p className="text-sm text-white/50">{order.garmentType} — Qty {order.quantity}</p>
                    </div>
                    <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-white/50 mb-4">No orders yet</p>
                <Link to="/portal/orders/new">
                  <Button>Place Your First Order</Button>
                </Link>
              </div>
            </Card>
          )}
        </>
      )}
    </PageWrapper>
  )
}
