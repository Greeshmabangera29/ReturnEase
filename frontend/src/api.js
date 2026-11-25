// All calls to the FastAPI backend live here.
// Paths start with /api — the Vite dev proxy forwards them to http://localhost:8000.

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Could not reach the server. Please check that the backend is running.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const detail = typeof body.detail === 'string' ? body.detail : 'Something went wrong.'
    throw new Error(detail)
  }
  return response.json()
}

export function fetchOrders() {
  return request('/api/orders')
}

export function analyzeReturn({ orderId, returnReason, customerDescription }) {
  return request('/api/analyze-return', {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      return_reason: returnReason,
      customer_description: customerDescription,
    }),
  })
}

export function createReturnRequest({
  orderId,
  returnReason,
  customerDescription,
  aiRecommendation,
  selectedResolution,
}) {
  return request('/api/return-requests', {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      return_reason: returnReason,
      customer_description: customerDescription,
      ai_recommendation: {
        issue_category: aiRecommendation.issue_category,
        recommended_resolution: aiRecommendation.recommended_resolution,
        explanation: aiRecommendation.explanation,
      },
      selected_resolution: selectedResolution,
    }),
  })
}
