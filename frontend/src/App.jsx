import { useEffect, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import ProgressSteps from './components/ProgressSteps'
import ErrorBanner from './components/ErrorBanner'
import OrderSelection from './screens/OrderSelection'
import ReturnDetails from './screens/ReturnDetails'
import AiRecommendation from './screens/AiRecommendation'
import Confirmation from './screens/Confirmation'
import { analyzeReturn, createReturnRequest, fetchOrders } from './api'

// App owns all flow state and decides which of the 4 screens to show.
// Screens are "dumb": they render props and call the callbacks below.
export default function App() {
  const [step, setStep] = useState(1)
  const [orders, setOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [returnReason, setReturnReason] = useState('')
  const [description, setDescription] = useState('')
  const [recommendation, setRecommendation] = useState(null)
  const [selectedResolution, setSelectedResolution] = useState('')
  const [savedRequest, setSavedRequest] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Load the sample orders from the backend once, when the app opens.
  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((error) => setErrorMessage(error.message))
      .finally(() => setIsLoadingOrders(false))
  }, [])

  function goToStep(nextStep) {
    setErrorMessage('')
    setStep(nextStep)
  }

  function handleSelectOrder(order) {
    setSelectedOrder(order)
    goToStep(2)
  }

  async function handleGetRecommendation() {
    setIsAnalyzing(true)
    setErrorMessage('')
    try {
      const result = await analyzeReturn({
        orderId: selectedOrder.order_id,
        returnReason,
        customerDescription: description.trim(),
      })
      setRecommendation(result)
      setSelectedResolution('') // customer must actively choose
      goToStep(3)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleSubmitRequest() {
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      const saved = await createReturnRequest({
        orderId: selectedOrder.order_id,
        returnReason,
        customerDescription: description.trim(),
        aiRecommendation: recommendation,
        selectedResolution,
      })
      setSavedRequest(saved)
      goToStep(4)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleStartOver() {
    setSelectedOrder(null)
    setReturnReason('')
    setDescription('')
    setRecommendation(null)
    setSelectedResolution('')
    setSavedRequest(null)
    goToStep(1)
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

        <div className={step === 1 ? '' : 'mx-auto max-w-2xl'}>
          <ErrorBanner message={errorMessage} />
        </div>

        {step === 1 && (
          <OrderSelection orders={orders} isLoading={isLoadingOrders} onSelectOrder={handleSelectOrder} />
        )}

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
              onBack={() => goToStep(2)}
              onSubmit={handleSubmitRequest}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {step === 4 && <Confirmation savedRequest={savedRequest} onStartOver={handleStartOver} />}
      </main>
    </div>
  )
}
