// All calls to the FastAPI backend live here.
// Paths start with /api — the Vite dev proxy forwards them to http://localhost:8000.

const SERVER_UNREACHABLE =
  'Could not reach the server. Please make sure the backend is running, then refresh the page.'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(SERVER_UNREACHABLE)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    if (typeof body.detail === 'string') throw new Error(body.detail)
    // A 5xx without a FastAPI error body usually means the dev proxy couldn't reach the backend.
    if (response.status >= 500) throw new Error(SERVER_UNREACHABLE)
    throw new Error('Something went wrong. Please check your details and try again.')
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
