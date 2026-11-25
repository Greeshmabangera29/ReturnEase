// Must match the ReturnReason values accepted by the backend (backend/models.py).
export const returnReasons = [
  "Size doesn't fit",
  'Product damaged',
  'Wrong product received',
  'Product not as expected',
  'Other',
]

export function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
