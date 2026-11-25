import { CalendarDays, Loader2, RotateCcw } from 'lucide-react'
import Button from '../components/Button'
import { formatDate, formatPrice } from '../constants'

// Screen 1: list of purchased orders; customer picks one to return/exchange.
export default function OrderSelection({ orders, isLoading, onSelectOrder }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">Your recent orders</h2>
      <p className="mt-1 text-sm text-slate-500">Choose the item you'd like to return or exchange.</p>

      {isLoading && (
        <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" />
          Loading your orders…
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <article
            key={order.order_id}
            className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm"
          >
            <img
              src={order.image_url}
              alt={order.product_name}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-slate-900">{order.product_name}</h3>
                <span className="text-sm font-semibold text-slate-900">{formatPrice(order.price)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Order #{order.order_id}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <CalendarDays size={14} />
                Purchased {formatDate(order.purchase_date)}
              </p>
              <Button className="mt-4 w-full" onClick={() => onSelectOrder(order)}>
                <RotateCcw size={16} />
                Return / Exchange
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
