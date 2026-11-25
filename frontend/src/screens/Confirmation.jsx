import { CheckCircle2, Plus } from 'lucide-react'
import Button from '../components/Button'

// Screen 4: success message with the request ID saved by the backend.
export default function Confirmation({ savedRequest, onStartOver }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center ring-1 ring-slate-200 shadow-sm sm:p-8">
      <CheckCircle2 size={56} className="mx-auto text-emerald-500" strokeWidth={1.5} />
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Request submitted</h2>
      <p className="mt-1 text-sm text-slate-500">
        We've received your request. Keep your request ID for reference.
      </p>

      <dl className="mt-6 divide-y divide-slate-200 rounded-xl bg-slate-50 text-left text-sm ring-1 ring-slate-200">
        <div className="flex justify-between gap-4 p-3">
          <dt className="text-slate-500">Request ID</dt>
          <dd className="font-mono font-semibold text-slate-900">{savedRequest.request_id}</dd>
        </div>
        <div className="flex justify-between gap-4 p-3">
          <dt className="text-slate-500">Product</dt>
          <dd className="font-medium text-slate-900">{savedRequest.product_name}</dd>
        </div>
        <div className="flex justify-between gap-4 p-3">
          <dt className="text-slate-500">Resolution</dt>
          <dd className="font-medium text-slate-900">{savedRequest.selected_resolution}</dd>
        </div>
      </dl>

      <Button className="mt-6 w-full" onClick={onStartOver}>
        <Plus size={16} />
        Start another request
      </Button>
    </div>
  )
}
