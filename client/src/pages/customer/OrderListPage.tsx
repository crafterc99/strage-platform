import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { ORDER_STATUS_LABELS } from '@/types'
import { STATUS_BADGE_VARIANT } from '@/lib/constants'
import { format } from 'date-fns'

export default function OrderListPage() {
  const { data: orders, isLoading } = useOrders()

  return (
    <PageWrapper
      title="My Orders"
      subtitle="Track all your orders"
      action={
        <Link to="/portal/orders/new">
          <Button>New Order</Button>
        </Link>
      }
    >
      {isLoading ? (
        <Spinner className="py-20" />
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/portal/orders/${order.id}`}>
              <Card hover className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-white">{order.orderNumber}</p>
                    <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/50">
                    {order.garmentType} — Qty {order.quantity} — {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
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
    </PageWrapper>
  )
}
