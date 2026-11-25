import { ArrowLeft, Loader2, RefreshCcw, Sparkles, Wallet } from 'lucide-react'
import Button from '../components/Button'
import ProductSummary from '../components/ProductSummary'

const resolutionOptions = [
  { value: 'Refund', icon: Wallet, description: 'Get your money back to the original payment method.' },
  { value: 'Exchange', icon: RefreshCcw, description: 'Get a replacement or a different size.' },
]

// Screen 3: shows the AI suggestion; the customer makes the final choice.
export default function AiRecommendation({
  order,
  recommendation,
  selectedResolution,
  onResolutionChange,
  onBack,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Our recommendation</h2>
      <div className="mt-4">
        <ProductSummary order={order} />
      </div>

      <div className="mt-6 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-100">
        <p className="flex items-center gap-2 text-sm font-medium text-indigo-700">
          <Sparkles size={16} />
          {recommendation.is_fallback ? 'Suggested resolution' : 'AI analysis'}
        </p>
        {recommendation.is_fallback && (
          <p className="mt-1 text-xs text-slate-500">
            Our AI assistant is unavailable right now, so this is a standard suggestion based on your
            selected reason.
          </p>
        )}
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Identified issue</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{recommendation.issue_category}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Suggested resolution</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{recommendation.recommended_resolution}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-slate-700">{recommendation.explanation}</p>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-slate-900">Choose your preferred resolution</legend>
        <p className="mt-1 text-xs text-slate-500">This is only a suggestion — the final choice is yours.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {resolutionOptions.map(({ value, icon: Icon, description }) => {
            const isSelected = value === selectedResolution
            const isRecommended = value === recommendation.recommended_resolution
            return (
              <label
                key={value}
                className={`relative flex cursor-pointer gap-3 rounded-xl p-4 ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${
                  isSelected ? 'bg-indigo-50 ring-2 ring-indigo-600' : 'bg-white ring-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="resolution"
                  value={value}
                  checked={isSelected}
                  onChange={() => onResolutionChange(value)}
                  className="sr-only"
                />
                <Icon size={20} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                <span>
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    {value}
                    {isRecommended && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        Suggested
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-500">{description}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={onSubmit} disabled={!selectedResolution || isSubmitting}>
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Submitting…' : 'Submit Request'}
        </Button>
      </div>
    </div>
  )
}
