import type { Product } from './types'

export function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    case 'price-desc':
      return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'))
    default:
      return sorted
  }
}

export const PRODUCTS_PER_PAGE = 24
