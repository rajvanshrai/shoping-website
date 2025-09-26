"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Heart, Share2, Star, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface GlowMenuProps {
  className?: string
}

type MenuState = "compact" | "expanded" | "glowing"

export function GlowMenu({ className }: GlowMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuState, setMenuState] = useState<MenuState>("compact")
  const { setCartOpen, wishlist } = useCartStore()
  const router = useRouter()

  const menuItems = [
    {
      icon: Heart,
      label: "Wishlist",
      color: "from-pink-500 to-rose-500",
      action: () => {
        router.push("/wishlist")
        setIsOpen(false)
        setMenuState("compact")
      },
    },
    {
      icon: Share2,
      label: "Share Store",
      color: "from-blue-500 to-cyan-500",
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: "Snack Cave - Premium Snacks",
            text: "Check out these amazing snacks!",
            url: window.location.href,
          })
        } else {
          navigator.clipboard.writeText(window.location.href)
          toast.success("Store link copied to clipboard!")
        }
        setIsOpen(false)
        setMenuState("compact")
      },
    },
    {
      icon: Star,
      label: "Featured",
      color: "from-yellow-500 to-orange-500",
      action: () => {
        const categoryTabs = document.querySelector('[data-category="Featured"]')
        if (categoryTabs) {
          categoryTabs.scrollIntoView({ behavior: "smooth" })
        }
        toast.info("Showing featured products")
        setIsOpen(false)
        setMenuState("compact")
      },
    },
    {
      icon: ShoppingBag,
      label: "View Cart",
      color: "from-green-500 to-emerald-500",
      action: () => {
        setCartOpen(true)
        setIsOpen(false)
        setMenuState("compact")
      },
    },
  ]

  const handleMenuToggle = () => {
    if (!isOpen) {
      setMenuState("glowing")
      setTimeout(() => {
        setIsOpen(true)
        setMenuState("expanded")
      }, 200)
    } else {
      setMenuState("compact")
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("fixed bottom-24 right-6 z-50", className)}>
      <div className="relative">
        <motion.div
          className="relative"
          animate={{
            scale: menuState === "glowing" ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className={cn(
              "relative rounded-full overflow-hidden transition-all duration-500",
              menuState === "compact" ? "w-14 h-14" : "w-16 h-16",
            )}
            style={{
              background: isOpen
                ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                : "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
              boxShadow: isOpen
                ? "0 8px 32px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                : "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <Button
              onClick={handleMenuToggle}
              className="w-full h-full bg-transparent hover:bg-white/10 border-0 rounded-full p-0"
            >
              <AnimatePresence>
                {menuState === "glowing" && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0.3 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg"
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={{
                  rotate: isOpen ? 45 : 0,
                  scale: menuState === "glowing" ? 1.2 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative z-10 flex items-center justify-center"
              >
                {isOpen ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                    <Plus className="h-6 w-6 text-white" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <Plus className="h-6 w-6 text-white" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-20 right-0 space-y-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0, y: 20, x: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: 0,
                    transition: {
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    y: 10,
                    x: 10,
                    transition: { delay: (menuItems.length - index - 1) * 0.05 },
                  }}
                  whileHover={{ scale: 1.1, x: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <motion.div
                    className="relative w-12 h-12 rounded-full overflow-hidden"
                    style={{
                      background: (() => {
                        const colorParts = item.color.split(" ")
                        const fromColor = colorParts[0]?.replace("from-", "") || "gray-500"
                        const toColor =
                          colorParts.find((part) => part.startsWith("to-"))?.replace("to-", "") || "gray-600"
                        return `linear-gradient(135deg, var(--${fromColor}) 0%, var(--${toColor}) 100%)`
                      })(),
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                    whileHover={{
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Button
                      onClick={item.action}
                      className="w-full h-full bg-transparent hover:bg-white/10 border-0 rounded-full p-0"
                    >
                      <item.icon className="h-5 w-5 text-white relative z-10" />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 15, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 15, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="absolute right-16 top-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <div className="px-4 py-2 rounded-xl text-sm font-medium text-gray-800 whitespace-nowrap flex items-center gap-2">
                      {item.label}
                      {item.label === "Wishlist" && wishlist.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                        >
                          {wishlist.length}
                        </motion.span>
                      )}
                    </div>
                    <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-white/95 border-y-4 border-y-transparent" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
              onClick={() => {
                setIsOpen(false)
                setMenuState("compact")
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
