"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ShoppingCart, Heart, X, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface NotificationData {
  id: string
  type: "success" | "error" | "info" | "cart" | "wishlist"
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationIslandProps {
  notifications: NotificationData[]
  onDismiss: (id: string) => void
}

type IslandState = "compact" | "expanded" | "stacked"

export function NotificationIsland({ notifications, onDismiss }: NotificationIslandProps) {
  const [islandState, setIslandState] = useState<IslandState>("compact")
  const activeNotification = notifications[0]

  useEffect(() => {
    if (notifications.length === 0) {
      setIslandState("compact")
    } else if (notifications.length === 1) {
      setIslandState("expanded")
    } else {
      setIslandState("stacked")
    }
  }, [notifications.length])

  // Auto-dismiss notifications
  useEffect(() => {
    if (activeNotification && activeNotification.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(activeNotification.id)
      }, activeNotification.duration || 4000)
      return () => clearTimeout(timer)
    }
  }, [activeNotification, onDismiss])

  if (!activeNotification) return null

  const getIcon = (type: NotificationData["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "cart":
        return <ShoppingCart className="h-4 w-4" />
      case "wishlist":
        return <Heart className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getColors = (type: NotificationData["type"]) => {
    switch (type) {
      case "success":
        return {
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          shadow: "0 8px 32px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }
      case "error":
        return {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          shadow: "0 8px 32px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }
      case "cart":
        return {
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          shadow: "0 8px 32px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }
      case "wishlist":
        return {
          background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
          shadow: "0 8px 32px rgba(236, 72, 153, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }
      default:
        return {
          background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
          shadow: "0 8px 32px rgba(107, 114, 128, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }
    }
  }

  const getDimensions = () => {
    switch (islandState) {
      case "compact":
        return "w-12 h-12"
      case "expanded":
        return activeNotification.action ? "w-96 h-16" : "w-80 h-14"
      case "stacked":
        return "w-96 h-20"
      default:
        return "w-12 h-12"
    }
  }

  const colors = getColors(activeNotification.type)

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      layout
    >
      <motion.div
        className={cn(
          "text-white rounded-full transition-all duration-700 ease-out overflow-hidden backdrop-blur-lg",
          getDimensions(),
        )}
        style={{
          background: colors.background,
          boxShadow: colors.shadow,
        }}
        layout
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full" />

        <AnimatePresence mode="wait">
          {islandState === "compact" ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center h-full"
            >
              {getIcon(activeNotification.type)}
            </motion.div>
          ) : islandState === "expanded" ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 px-4 h-full"
            >
              <div className="flex-shrink-0">{getIcon(activeNotification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{activeNotification.title}</div>
                {activeNotification.message && (
                  <div className="text-xs opacity-90 truncate">{activeNotification.message}</div>
                )}
              </div>
              {activeNotification.action && (
                <Button
                  onClick={activeNotification.action.onClick}
                  variant="ghost"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full px-3 py-1 text-xs"
                >
                  {activeNotification.action.label}
                </Button>
              )}
              <Button
                onClick={() => onDismiss(activeNotification.id)}
                variant="ghost"
                size="icon"
                className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="stacked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col gap-2 p-3 h-full"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getIcon(activeNotification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{activeNotification.title}</div>
                  {activeNotification.message && (
                    <div className="text-xs opacity-90 truncate">{activeNotification.message}</div>
                  )}
                </div>
                <Button
                  onClick={() => onDismiss(activeNotification.id)}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs opacity-80">
                <span>{notifications.length} notifications</span>
                <Button
                  onClick={() => notifications.forEach((n) => onDismiss(n.id))}
                  variant="ghost"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full px-2 py-1 text-xs h-auto"
                >
                  Clear all
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
