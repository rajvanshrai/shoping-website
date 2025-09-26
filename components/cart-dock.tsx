"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/store"
import { User, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { cn } from "@/lib/utils"

type DockState = "compact" | "expanded"

export function CartDock() {
  const { itemCount, setCartOpen, user, logout, total } = useCartStore()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [dockState, setDockState] = useState<DockState>("compact")
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (itemCount === 0) {
      setDockState("compact")
    } else {
      setDockState("expanded")
    }
  }, [itemCount])

  useEffect(() => {
    if (itemCount > 0) {
      setShowNotification(true)
      const timer = setTimeout(() => setShowNotification(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  const handleCartClick = () => {
    setCartOpen(true)
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent opening checkout when clicking profile
    if (user) {
      logout()
    } else {
      setIsLoginOpen(true)
    }
  }

  const getDockDimensions = () => {
    switch (dockState) {
      case "compact":
        return "w-16 h-16"
      case "expanded":
        return "w-64 h-16"
      default:
        return "w-16 h-16"
    }
  }

  const renderDockContent = () => {
    switch (dockState) {
      case "compact":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center h-full"
          >
            <ShoppingCart className="h-6 w-6 text-white" />
          </motion.div>
        )

      case "expanded":
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-4 h-full"
          >
            <div className="relative flex items-center gap-3 text-white rounded-full px-4 py-2">
              <div className="relative">
                <div className="bg-white/20 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </div>
                <AnimatePresence>
                  {showNotification && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"
                    />
                  )}
                </AnimatePresence>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Cart</div>
                <div className="text-xs opacity-80">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full p-2 transition-all duration-200",
                user ? "bg-green-500/20 hover:bg-green-500/30" : "bg-white/20 hover:bg-white/30",
              )}
              onClick={handleProfileClick}
            >
              {user ? (
                user.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-6 w-6 rounded-full" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </Button>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          onClick={handleCartClick} // click anywhere opens checkout
          className={cn(
            "bg-gradient-to-r from-slate-800/95 via-slate-900/95 to-slate-800/95 text-white rounded-full",
            "shadow-lg backdrop-blur-md border border-white/10",
            "transition-all duration-700 ease-out overflow-hidden cursor-pointer",
            getDockDimensions(),
          )}
          layout
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full" />
          {renderDockContent()}
        </motion.div>
      </motion.div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
