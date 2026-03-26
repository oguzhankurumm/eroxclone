export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateDiscount(price: number, salePrice: number): number {
  if (!salePrice || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

export function formatWhatsAppMessage(
  orderNumber: string,
  items: { name: string; quantity: number; price: number }[],
  total: number
): string {
  let message = `Merhaba, sipariş vermek istiyorum.\n\n`
  message += `Sipariş No: ${orderNumber}\n\n`
  items.forEach((item) => {
    message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`
  })
  message += `\nToplam: ${formatPrice(total)}`
  return encodeURIComponent(message)
}

export function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(2, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `ERX-${date}-${random}`
}
