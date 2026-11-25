// TEMPORARY (Phase 2 only): fakes the AI recommendation so the full flow works
// before the backend exists. Phase 4 replaces this with POST /api/analyze-return.

const mockByReason = {
  "Size doesn't fit": {
    issue_category: 'Size/Fit Issue',
    recommended_resolution: 'Exchange',
    explanation: 'The product does not fit as expected. Exchanging it for a different size may be suitable.',
  },
  'Product damaged': {
    issue_category: 'Damaged Product',
    recommended_resolution: 'Refund',
    explanation: 'The product arrived damaged. A refund may be suitable, or you can exchange it for a new unit.',
  },
  'Wrong product received': {
    issue_category: 'Wrong Item Delivered',
    recommended_resolution: 'Exchange',
    explanation: 'A different item was delivered. Exchanging it for the product you ordered may be suitable.',
  },
  'Product not as expected': {
    issue_category: 'Expectation Mismatch',
    recommended_resolution: 'Refund',
    explanation: 'The product did not match your expectations. A refund may be suitable.',
  },
  Other: {
    issue_category: 'General Issue',
    recommended_resolution: 'Refund',
    explanation: 'Based on your description, a refund may be suitable. You can choose an exchange instead.',
  },
}

export function getMockRecommendation(returnReason) {
  const recommendation = mockByReason[returnReason] ?? mockByReason.Other
  // Simulate network/AI latency so the loading state is visible.
  return new Promise((resolve) => setTimeout(() => resolve(recommendation), 1200))
}
