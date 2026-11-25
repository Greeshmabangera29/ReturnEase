import { useState } from 'react'
import { PackageOpen } from 'lucide-react'
import ProgressSteps from './components/ProgressSteps'
import OrderSelection from './screens/OrderSelection'
import ReturnDetails from './screens/ReturnDetails'
import AiRecommendation from './screens/AiRecommendation'
import Confirmation from './screens/Confirmation'
import { sampleOrders } from './data/orders'
import { getMockRecommendation } from './data/mockAi'

// TEMPORARY (Phase 2 only): the backend will generate real request IDs in Phase 3.
function generateMockRequestId() {
  return `RE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

// App owns all flow state and decides which of the 4 screens to show.
// Screens are "dumb": they render props and call the callbacks below.
export default function App() {
  const [step, setStep] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [description, setDescription] = useState('')
  const [recommendation, setRecommendation] = useState(null)
  const [selectedResolution, setSelectedResolution] = useState('')
  const [requestId, setRequestId] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSelectOrder(order) {
    setSelectedOrder(order)
    setStep(2)
  }

  async function handleGetRecommendation() {
    setIsAnalyzing(true)
    const result = await getMockRecommendation(returnReason)
    setRecommendation(result)
    setSelectedResolution('') // customer must actively choose
    setIsAnalyzing(false)
    setStep(3)
  }

  async function handleSubmitRequest() {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600)) // simulate save
    setRequestId(generateMockRequestId())
    setIsSubmitting(false)
    setStep(4)
  }

  function handleStartOver() {
    setSelectedOrder(null)
    setReturnReason('')
    setDescription('')
    setRecommendation(null)
    setSelectedResolution('')
    setRequestId('')
    setStep(1)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <PackageOpen size={18} />
          </span>
          <div>
            <p className="font-semibold leading-tight text-slate-900">ReturnEase</p>
            <p className="text-xs text-slate-500">Returns &amp; Exchanges</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <div className="mb-8">
          <ProgressSteps currentStep={step} />
        </div>

        {step === 1 && <OrderSelection orders={sampleOrders} onSelectOrder={handleSelectOrder} />}

        {step === 2 && (
          <div className="mx-auto max-w-2xl">
            <ReturnDetails
              order={selectedOrder}
              returnReason={returnReason}
              description={description}
              onReasonChange={setReturnReason}
              onDescriptionChange={setDescription}
              onBack={handleStartOver}
              onSubmit={handleGetRecommendation}
              isLoading={isAnalyzing}
            />
          </div>
        )}

        {step === 3 && (
          <div className="mx-auto max-w-2xl">
            <AiRecommendation
              order={selectedOrder}
              recommendation={recommendation}
              selectedResolution={selectedResolution}
              onResolutionChange={setSelectedResolution}
              onBack={() => setStep(2)}
              onSubmit={handleSubmitRequest}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {step === 4 && (
          <Confirmation
            requestId={requestId}
            productName={selectedOrder.productName}
            selectedResolution={selectedResolution}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  )
}
