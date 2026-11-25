import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import ProductSummary from '../components/ProductSummary'
import { returnReasons } from '../constants'

const MIN_DESCRIPTION_LENGTH = 10
const MAX_DESCRIPTION_LENGTH = 500

// Screen 2: customer picks a reason and describes the issue.
export default function ReturnDetails({
  order,
  returnReason,
  description,
  onReasonChange,
  onDescriptionChange,
  onBack,
  onSubmit,
  isLoading,
}) {
  const trimmedLength = description.trim().length
  const canContinue = returnReason && trimmedLength >= MIN_DESCRIPTION_LENGTH && !isLoading

  function handleSubmit(event) {
    event.preventDefault()
    if (canContinue) onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Tell us what went wrong</h2>
      <div className="mt-4">
        <ProductSummary order={order} />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-slate-900">Reason for return</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {returnReasons.map((reason) => {
            const isSelected = reason === returnReason
            return (
              <label
                key={reason}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 ring-indigo-600'
                    : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="returnReason"
                  value={reason}
                  checked={isSelected}
                  onChange={() => onReasonChange(reason)}
                  className="sr-only"
                />
                {reason}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="description" className="text-sm font-medium text-slate-900">
          Describe the issue
        </label>
        <textarea
          id="description"
          rows={4}
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="e.g. The shoes are too tight around the toes, I usually wear size 9."
          className="mt-2 block w-full resize-none rounded-xl border-0 p-3 text-sm text-slate-900 ring-1 ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>
            {trimmedLength < MIN_DESCRIPTION_LENGTH
              ? `At least ${MIN_DESCRIPTION_LENGTH} characters`
              : ' '}
          </span>
          <span>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack} disabled={isLoading}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button type="submit" disabled={!canContinue}>
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isLoading ? 'Analyzing…' : 'Get AI Recommendation'}
        </Button>
      </div>
    </form>
  )
}
