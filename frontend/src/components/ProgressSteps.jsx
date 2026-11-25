import { Check } from 'lucide-react'

const steps = ['Select order', 'Return details', 'Recommendation', 'Confirmation']

// Horizontal step indicator. `currentStep` is 1-based.
export default function ProgressSteps({ currentStep }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isFinished = currentStep === steps.length // on the confirmation screen, every step is done
        const isDone = stepNumber < currentStep || isFinished
        const isActive = stepNumber === currentStep && !isFinished

        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? 'bg-indigo-600 text-white'
                    : isActive
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : stepNumber}
              </span>
              {/* Labels hide on small screens to keep the bar on one line */}
              <span
                className={`hidden text-sm sm:inline ${
                  isActive ? 'font-medium text-slate-900' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
            </div>
            {stepNumber < steps.length && (
              <span className={`h-px flex-1 ${isDone ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
