"use client"

import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface DynamicIslandProps {
  className?: string
}

type IslandState = "compact" | "expanded" | "music" | "notification"

export function DynamicIsland({ className }: DynamicIslandProps) {
  const [state, setState] = useState<IslandState>("compact")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("2:34")
  const [isLiked, setIsLiked] = useState(false)

  // Auto-cycle through states for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        switch (prev) {
          case "compact":
            return "notification"
          case "notification":
            return "music"
          case "music":
            return "expanded"
          case "expanded":
            return "compact"
          default:
            return "compact"
        }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Simulate time updates when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const [min, sec] = prev.split(":").map(Number)
          const totalSec = min * 60 + sec + 1
          const newMin = Math.floor(totalSec / 60)
          const newSec = totalSec % 60
          return `${newMin}:${newSec.toString().padStart(2, "0")}`
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const baseClasses = cn(
    "fixed top-4 left-1/2 -translate-x-1/2 z-50",
    "bg-black text-white rounded-full",
    "transition-all duration-700 ease-out",
    "shadow-2xl backdrop-blur-lg",
    "border border-white/10",
    "overflow-hidden",
    className,
  )

  const getIslandDimensions = () => {
    switch (state) {
      case "compact":
        return "w-32 h-8"
      case "notification":
        return "w-48 h-12"
      case "music":
        return "w-80 h-16"
      case "expanded":
        return "w-96 h-20"
      default:
        return "w-32 h-8"
    }
  }

  const renderContent = () => {
    switch (state) {
      case "compact":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        )

      case "notification":
        return (
          <div className="flex items-center justify-between px-4 h-full">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-xs font-medium">New message</span>
          </div>
        )

      case "music":
        return (
          <div className="flex items-center gap-3 px-4 h-full">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white/20 rounded backdrop-blur-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Midnight City</div>
              <div className="text-xs text-white/70 truncate">M83</div>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        )

      case "expanded":
        return (
          <div className="flex items-center gap-4 px-6 h-full">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Midnight City</div>
              <div className="text-xs text-white/70 truncate">M83 • Hurry Up, We're Dreaming</div>
              <div className="text-xs text-white/50 mt-1">{currentTime} / 4:03</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isLiked ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30",
                )}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              </button>
              <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors text-black"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn(baseClasses, getIslandDimensions())}
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full" />
      {renderContent()}
    </div>
  )
}
