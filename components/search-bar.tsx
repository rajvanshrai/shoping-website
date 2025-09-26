"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
}

type SearchState = "compact" | "focused" | "searching" | "results"

const trendingSearches = [
  "Chocolate chips",
  "Organic snacks",
  "Protein bars",
  "Nuts & seeds",
  "Healthy treats",
]

export function SearchBar({
  value,
  onChange,
  onKeyPress,
  className,
}: SearchBarProps) {
  const [searchState, setSearchState] = useState<SearchState>("compact")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length > 0) {
      setSearchState("searching")
    } else if (showSuggestions) {
      setSearchState("focused")
    } else {
      setSearchState("compact")
    }
  }, [value, showSuggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSearchState("compact")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFocus = () => {
    setSearchState("focused")
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    setSearchState("searching")
  }

  const clearSearch = () => {
    onChange("")
    setSearchState("focused")
    inputRef.current?.focus()
  }

  const isExpanded = searchState === "focused" || searchState === "searching"

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Outer pill — ONLY this element has rounded background/border */}
      <div
        className={cn(
          "relative transition-all duration-300 ease-out rounded-full overflow-hidden flex items-center",
          isExpanded ? "w-full max-w-lg h-14" : "w-full max-w-md h-12",
          isExpanded
            ? "bg-background border-2 border-primary/30"
            : "bg-card/50 backdrop-blur-sm border border-border/30",
          "shadow-lg px-3"
        )}
      >
        {/* Left icon */}
        <motion.div
          className="flex-none mr-3"
          animate={{ scale: searchState === "searching" ? 1.1 : 1 }}
        >
          {searchState === "searching" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
          ) : (
            <Search className="h-5 w-5 text-muted-foreground" />
          )}
        </motion.div>

        {/* Native input fills the pill (transparent + borderless) */}
        <input
          ref={inputRef}
          type="text"
          aria-label="Search"
          placeholder={
            searchState === "focused"
              ? "What delicious snacks are you craving?"
              : "Search for delicious snacks..."
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={onKeyPress}
          className={cn(
            "flex-1 h-full w-full bg-transparent border-0 outline-none focus:outline-none",
            "text-sm",
            isExpanded ? "text-base" : "text-sm"
          )}
          style={{ paddingLeft: 0, paddingRight: 0, borderRadius: 9999 }}
          autoComplete="off"
        />

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex-none"
            >
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50 z-[60] overflow-hidden"
          >
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mb-4"
              >
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground/70">
                  Trending Searches
                </span>
              </motion.div>

              <div className="space-y-1">
                {trendingSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-foreground"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
