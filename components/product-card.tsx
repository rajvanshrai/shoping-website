"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Star, Heart, Sparkles, Zap, Check } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
  onProductClick?: (product: Product) => void
}

type CardState = "idle" | "hover" | "adding" | "added" | "wishlisting"

export function ProductCard({ product, className, onProductClick }: ProductCardProps) {
  const [cardState, setCardState] = useState<CardState>("idle")
  const [isWishlistAdding, setIsWishlistAdding] = useState(false)
  const { addItem, addToWishlist, removeFromWishlist, isInWishlist } = useCartStore()
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setCardState("adding")
    addItem(product)

    setTimeout(() => {
      setCardState("added")
      setTimeout(() => setCardState("idle"), 1500)
    }, 600)
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setCardState("wishlisting")
    setIsWishlistAdding(true)

    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }

    setTimeout(() => {
      setIsWishlistAdding(false)
      setCardState("idle")
    }, 400)
  }

  const handleCardClick = () => {
    onProductClick?.(product)
  }

  const getCardStyle = () => {
    switch (cardState) {
      case "hover":
        return {
          scale: 1.03,
          y: -8,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2)",
        }
      case "adding":
        return {
          scale: 1.05,
          y: -12,
          boxShadow: "0 25px 50px rgba(34, 197, 94, 0.2), 0 0 0 2px rgba(34, 197, 94, 0.3)",
        }
      case "added":
        return {
          scale: 1.02,
          y: -4,
          boxShadow: "0 15px 30px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.2)",
        }
      default:
        return {
          scale: 1,
          y: 0,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }
    }
  }

  return (
    <motion.div
      animate={getCardStyle()}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onHoverStart={() => setCardState("hover")}
      onHoverEnd={() => cardState === "hover" && setCardState("idle")}
    >
      <Card
        className={cn(
          "group relative overflow-hidden bg-card border-0 cursor-pointer",
          "transition-all duration-300",
          className,
        )}
        onClick={handleCardClick}
      >
        <AnimatePresence>
          {product.rating >= 4.5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute top-3 left-3 z-10 rounded-full text-xs font-semibold flex items-center gap-1 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="px-3 py-1.5 flex items-center gap-1 text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-3 w-3" />
                </motion.div>
                Premium
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="absolute top-3 right-3 z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <motion.div
            className={cn(
              "rounded-full overflow-hidden backdrop-blur-sm transition-all duration-300",
              isWishlisted ? "w-10 h-10" : "w-8 h-8",
            )}
            style={{
              background: isWishlisted
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                : "rgba(255, 255, 255, 0.9)",
              boxShadow: isWishlisted
                ? "0 4px 12px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                : "0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <Button
              onClick={handleWishlistToggle}
              variant="ghost"
              size="icon"
              className="w-full h-full bg-transparent hover:bg-transparent border-0 p-0"
            >
              <motion.div
                animate={{
                  scale: isWishlistAdding ? [1, 1.3, 1] : 1,
                  rotate: isWishlistAdding ? [0, 15, -15, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <Heart
                  className={cn("h-4 w-4 transition-colors", isWishlisted ? "fill-white text-white" : "text-gray-600")}
                />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <div className="aspect-square relative overflow-hidden rounded-t-xl">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background:
                  cardState === "adding"
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              <Button
                onClick={handleAddToCart}
                disabled={cardState === "adding" || !product.inStock}
                className="bg-transparent hover:bg-white/10 border-0 px-6 py-2 text-gray-800 font-medium"
              >
                <AnimatePresence mode="wait">
                  {cardState === "adding" ? (
                    <motion.div
                      key="adding"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 text-white"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Zap className="h-4 w-4" />
                      </motion.div>
                      Adding...
                    </motion.div>
                  ) : cardState === "added" ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 text-green-600"
                    >
                      <Check className="h-4 w-4" />
                      Added!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quick-add"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      Quick Add
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 200) + 50})</span>
            </div>
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                product.inStock
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
              )}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-balance leading-tight group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {Math.random() > 0.7 && (
                <span className="text-sm text-muted-foreground line-through">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <motion.div
                className="rounded-full overflow-hidden"
                style={{
                  background:
                    cardState === "adding" || cardState === "added"
                      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={cardState === "adding" || !product.inStock}
                  className="h-12 w-12 p-0 bg-transparent hover:bg-white/10 border-0"
                >
                  <AnimatePresence mode="wait">
                    {cardState === "adding" ? (
                      <motion.div
                        key="adding-icon"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Zap className="h-5 w-5 text-white" />
                        </motion.div>
                      </motion.div>
                    ) : cardState === "added" ? (
                      <motion.div
                        key="added-icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <Check className="h-5 w-5 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cart-icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
