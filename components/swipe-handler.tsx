"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useCartStore } from "@/lib/store"

interface SwipeHandlerProps {
  children: React.ReactNode
}

export function SwipeHandler({ children }: SwipeHandlerProps) {
  const { setCartOpen, isCartOpen } = useCartStore()
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setStartY(touch.clientY)
      setCurrentY(touch.clientY)
      setIsDragging(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const touch = e.touches[0]
      setCurrentY(touch.clientY)

      const deltaY = startY - touch.clientY

      // Only trigger swipe up from bottom 100px of screen
      if (startY > window.innerHeight - 100 && deltaY > 50) {
        e.preventDefault()
        if (!isCartOpen) {
          setCartOpen(true)
        }
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      setStartY(0)
      setCurrentY(0)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: false })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, startY, isCartOpen, setCartOpen])

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  )
}
