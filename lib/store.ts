"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem, CartState } from "./types"

interface CartStore extends CartState {
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isCartOpen: false,
      wishlist: [],
      user: null,
      isDarkMode: false,

      addItem: (product: Product) => {
        const { items } = get()
        const existingItem = items.find((item) => item.product.id === product.id)

        let newItems: CartItem[]
        if (existingItem) {
          newItems = items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        } else {
          newItems = [...items, { product, quantity: 1 }]
        }

        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, itemCount })
      },

      removeItem: (productId: string) => {
        const { items } = get()
        const newItems = items.filter((item) => item.product.id !== productId)
        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, itemCount })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const { items } = get()
        const newItems = items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))

        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, itemCount })
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 })
      },

      clearWishlist: () => {
        set({ wishlist: [] })
      },

      setCartOpen: (open: boolean) => {
        set({ isCartOpen: open })
      },

      addToWishlist: (product: Product) => {
        const { wishlist } = get()
        if (!wishlist.find((item) => item.id === product.id)) {
          set({ wishlist: [...wishlist, product] })
        }
      },

      removeFromWishlist: (productId: string) => {
        const { wishlist } = get()
        set({ wishlist: wishlist.filter((item) => item.id !== productId) })
      },

      isInWishlist: (productId: string) => {
        const { wishlist } = get()
        return wishlist.some((item) => item.id === productId)
      },

      setUser: (user: User | null) => {
        set({ user })
      },

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simple validation for demo
        if (email && password.length >= 6) {
          const user: User = {
            id: "1",
            name: email.split("@")[0],
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          }
          set({ user })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null })
      },

      toggleDarkMode: () => {
        const { isDarkMode } = get()
        const newDarkMode = !isDarkMode
        set({ isDarkMode: newDarkMode })

        // Apply dark mode class to document
        if (typeof document !== "undefined") {
          if (newDarkMode) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
