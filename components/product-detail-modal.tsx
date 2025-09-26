"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Star, Heart, ShoppingCart, Plus, Minus, Share2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, addToWishlist, removeFromWishlist, isInWishlist, updateQuantity, items } = useCartStore()

  const isWishlisted = product ? isInWishlist(product.id) : false
  const cartItem = product ? items.find((item) => item.product.id === product.id) : null

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setQuantity(cartItem?.quantity || 1)
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, cartItem])

  if (!product) return null

  const handleAddToCart = async () => {
    setIsAdding(true)

    if (cartItem) {
      // Update existing item quantity
      updateQuantity(product.id, quantity)
    } else {
      // Add new item with specified quantity
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
    }

    setTimeout(() => {
      setIsAdding(false)
    }, 600)
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const nutritionFacts = [
    { label: "Calories", value: "120" },
    { label: "Protein", value: "3g" },
    { label: "Carbs", value: "15g" },
    { label: "Fat", value: "5g" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal with Dynamic Island Animation */}
          <motion.div
            initial={{
              scale: 0.3,
              opacity: 0,
              borderRadius: "50px",
              width: "200px",
              height: "60px",
              x: "50%",
              y: "50%",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              borderRadius: "24px",
              width: "auto",
              height: "auto",
              x: 0,
              y: 0,
            }}
            exit={{
              scale: 0.3,
              opacity: 0,
              borderRadius: "50px",
              width: "200px",
              height: "60px",
              transition: { duration: 0.4, ease: "easeInOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.6,
            }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-card rounded-3xl max-w-2xl mx-auto max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {product.category}
                </Badge>
                {product.rating >= 4.5 && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleWishlistToggle}
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full", isWishlisted && "text-red-500 hover:text-red-600")}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                {/* Product Image and Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold text-balance leading-tight">{product.name}</h1>
                      <p className="text-muted-foreground mt-2">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({Math.floor(Math.random() * 200) + 50} reviews)
                        </span>
                      </div>
                      <Badge
                        variant={product.inStock ? "default" : "destructive"}
                        className={
                          product.inStock ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""
                        }
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{quantity}</span>
                          <Button
                            onClick={() => setQuantity(quantity + 1)}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={handleAddToCart}
                        disabled={isAdding || !product.inStock}
                        className={cn(
                          "w-full rounded-2xl py-6 text-lg font-semibold",
                          "bg-primary hover:bg-primary/90 transition-all duration-300",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isAdding && "animate-bounce-gentle",
                        )}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {isAdding ? "Adding..." : cartItem ? "Update Cart" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div className="bg-muted/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Nutrition Facts</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {nutritionFacts.map((fact) => (
                      <div key={fact.label} className="text-center">
                        <div className="text-2xl font-bold text-primary">{fact.value}</div>
                        <div className="text-sm text-muted-foreground">{fact.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Product Details</h3>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                      This premium snack is carefully crafted with the finest ingredients to deliver exceptional taste
                      and quality. Perfect for any time of day, whether you're looking for a quick energy boost or a
                      satisfying treat.
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-3">
                      <li>Made with natural ingredients</li>
                      <li>No artificial preservatives</li>
                      <li>Gluten-free and vegan-friendly</li>
                      <li>Sustainably sourced</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
