import { formatDate, formatPrice } from '../data/orders'

// Compact row showing the selected product; reused on screens 2 and 3.
export default function ProductSummary({ order }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <img
        src={order.imageUrl}
        alt={order.productName}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{order.productName}</p>
        <p className="text-sm text-slate-500">
          Order #{order.orderId} · {formatDate(order.purchaseDate)}
        </p>
        <p className="text-sm font-medium text-slate-700">{formatPrice(order.price)}</p>
      </div>
    </div>
  )
}
