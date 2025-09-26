export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  inStock: boolean
  stock?: number
  createdAt?: string
  popularity?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
