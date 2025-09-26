"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"

interface DarkModeToggleProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

type ToggleState = "light" | "dark" | "transitioning"

export function DarkModeToggle({ variant = "ghost", size = "icon", className }: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useCartStore()
  const [toggleState, setToggleState] = useState<ToggleState>(isDarkMode ? "dark" : "light")

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
        setToggleState("dark")
      } else {
        document.documentElement.classList.remove("dark")
        setToggleState("light")
      }
    }
  }, [isDarkMode])

  const handleToggle = () => {
    setToggleState("transitioning")
    setTimeout(() => {
      toggleDarkMode()
      setTimeout(() => {
        setToggleState(isDarkMode ? "light" : "dark")
      }, 100)
    }, 200)
  }

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <motion.div
        className="rounded-full overflow-hidden"
        animate={{
          width: toggleState === "transitioning" ? 60 : 40,
          height: 40,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          background:
            toggleState === "dark"
              ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
              : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          boxShadow:
            toggleState === "dark"
              ? "0 4px 12px rgba(31, 41, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 4px 12px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="w-full h-full bg-transparent hover:bg-white/10 border-0 p-0"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait">
            {toggleState === "transitioning" ? (
              <motion.div
                key="transitioning"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
              </motion.div>
            ) : toggleState === "dark" ? (
              <motion.div
                key="dark"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="h-5 w-5 text-yellow-300" />
              </motion.div>
            ) : (
              <motion.div
                key="light"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </motion.div>
  )
}
