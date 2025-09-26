"use client"

import { useEffect, useRef, useState } from "react"
import { X, Plus, Minus, CreditCard, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment-modal"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function CartDrawer() {
  const { items, total, itemCount, isCartOpen, setCartOpen, updateQuantity, removeItem } = useCartStore()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const drawerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isCartOpen])

  const handleClose = () => {
    setCartOpen(false)
  }

  const deliveryFee = 4.0
  const finalTotal = total + deliveryFee

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300",
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl",
          "transition-all duration-500 ease-out",
          "h-[85vh] sm:h-[80vh] flex flex-col",
          isCartOpen ? "translate-y-0 animate-slide-up" : "translate-y-full",
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Your Cart</h2>
            {itemCount > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
                {itemCount}
              </div>
            )}
          </div>
          <Button onClick={handleClose} variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="bg-muted/50 rounded-full p-8 mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-center">Add some delicious snacks to get started!</p>
              <Button onClick={handleClose} className="mt-6 rounded-2xl px-8">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable Area */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 bg-muted/30 rounded-2xl p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base truncate">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-background rounded-xl p-1">
                          <Button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-muted"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center font-semibold">{item.quantity}</span>

                          <Button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-muted"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right min-w-0">
                          <div className="font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</div>
                        </div>

                        <Button
                          onClick={() => removeItem(item.product.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary and Payment - Fixed at Bottom */}
              <div className="flex-shrink-0 border-t border-border/20 bg-card">
                {/* Summary */}
                <div className="px-6 py-4">
                  <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-border/50 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="px-6 pb-6">
                  <Button
                    className={cn(
                      "w-full bg-primary text-primary-foreground rounded-2xl py-6 text-lg font-semibold",
                      "hover:bg-primary/90 transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      "shadow-lg hover:shadow-xl",
                    )}
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </>
  )
}
