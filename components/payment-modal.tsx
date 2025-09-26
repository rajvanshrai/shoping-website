"use client"

import { useState } from "react"
import { X, CreditCard, Smartphone, Wallet, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const { total, itemCount, clearCart } = useCartStore()
  const deliveryFee = 4.0
  const finalTotal = total + deliveryFee

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Clear cart after successful payment
    setTimeout(() => {
      clearCart()
      setIsSuccess(false)
      onClose()
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden animate-slide-up">
        {isSuccess ? (
          // Success State
          <div className="p-6 sm:p-8 text-center">
            <div className="bg-green-100 rounded-full p-4 sm:p-6 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Your order has been confirmed and will be delivered soon.
            </p>
            <div className="bg-muted rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">Order Total</p>
              <p className="text-xl sm:text-2xl font-bold">${finalTotal.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/50">
              <h2 className="text-lg sm:text-xl font-bold">Checkout</h2>
              <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Order Summary */}
              <div className="p-4 sm:p-6 border-b border-border/50">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items ({itemCount})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-4 sm:p-6 border-b border-border/50">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer text-sm sm:text-base">
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="apple" id="apple" />
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="apple" className="flex-1 cursor-pointer text-sm sm:text-base">
                        Apple Pay
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="google" id="google" />
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="google" className="flex-1 cursor-pointer text-sm sm:text-base">
                        Google Pay
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Form */}
              {paymentMethod === "card" && (
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="text-sm">
                        Cardholder Name
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange("cardName", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm">
                        Delivery Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm">
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-sm">
                          ZIP Code
                        </Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Payment Methods */}
              {(paymentMethod === "apple" || paymentMethod === "google") && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-6 sm:py-8">
                    <div className="bg-muted rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                      {paymentMethod === "apple" ? (
                        <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                      ) : (
                        <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">
                      {paymentMethod === "apple" ? "Apple Pay" : "Google Pay"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      You'll be redirected to complete your payment securely.
                    </p>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="p-4 sm:p-6 bg-muted/30">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>

              {/* Pay Button */}
              <div className="p-4 sm:p-6">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={cn(
                    "w-full bg-primary text-primary-foreground rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold",
                    "hover:bg-primary/90 transition-all duration-300",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "shadow-lg hover:shadow-xl",
                    isProcessing && "animate-pulse",
                  )}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    `Pay $${finalTotal.toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
