// Sample purchased orders for the demo (not real customer data).
// Phase 3 will move these to the backend's GET /api/orders endpoint.
// Images are from Unsplash (free to use under the Unsplash License).
export const sampleOrders = [
  {
    orderId: 'ORD1001',
    productName: 'Nike Running Shoes',
    price: 2499,
    purchaseDate: '2026-11-12',
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
  },
  {
    orderId: 'ORD1002',
    productName: 'Casual Blue Shirt',
    price: 999,
    purchaseDate: '2026-11-15',
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80&auto=format&fit=crop',
  },
  {
    orderId: 'ORD1003',
    productName: 'Leather Handbag',
    price: 1899,
    purchaseDate: '2026-11-18',
    imageUrl:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&auto=format&fit=crop',
  },
]

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
