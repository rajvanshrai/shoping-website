"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
}

interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  sortBy: string
  inStock: boolean
}

const categories = ["All", "Choco", "Snacks", "Drinks", "Healthy", "Premium"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
]

export function FilterModal({ isOpen, onClose, onApplyFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100],
    categories: ["All"],
    sortBy: "popular",
    inStock: true,
  })

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      priceRange: [0, 100],
      categories: ["All"],
      sortBy: "popular",
      inStock: true,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0">
      <div className="fixed inset-x-4 top-20 bottom-20 bg-card rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filters.categories.includes(category) ? "default" : "outline"}
                    className={cn(
                      "justify-start rounded-full transition-all duration-200",
                      filters.categories.includes(category) && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => {
                      if (category === "All") {
                        setFilters((prev) => ({ ...prev, categories: ["All"] }))
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          categories: prev.categories.includes(category)
                            ? prev.categories.filter((c) => c !== category)
                            : [...prev.categories.filter((c) => c !== "All"), category],
                        }))
                      }
                    }}
                  >
                    {filters.categories.includes(category) && <Check className="h-4 w-4 mr-2" />}
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Min</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [Number.parseInt(e.target.value), prev.priceRange[1]],
                        }))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-sm font-medium">${filters.priceRange[0]}</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Max</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], Number.parseInt(e.target.value)],
                        }))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-sm font-medium">${filters.priceRange[1]}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value ? "default" : "ghost"}
                    className="w-full justify-start rounded-full"
                    onClick={() => setFilters((prev) => ({ ...prev, sortBy: option.value }))}
                  >
                    {filters.sortBy === option.value && <Check className="h-4 w-4 mr-2" />}
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div>
              <Button
                variant={filters.inStock ? "default" : "outline"}
                className="w-full justify-start rounded-full"
                onClick={() => setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))}
              >
                {filters.inStock && <Check className="h-4 w-4 mr-2" />}
                Show only in stock items
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1 rounded-full bg-transparent">
                Reset
              </Button>
              <Button onClick={handleApply} className="flex-1 rounded-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
