"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/products"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category, index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="relative rounded-full overflow-hidden"
            layout
            style={{
              background:
                selectedCategory === category
                  ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)",
              boxShadow:
                selectedCategory === category
                  ? "0 8px 24px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <Button
              onClick={() => onCategoryChange(category)}
              className={cn(
                "rounded-full px-6 py-2 whitespace-nowrap border-0 bg-transparent hover:bg-white/10",
                "transition-all duration-300 font-medium",
                selectedCategory === category ? "text-white shadow-none" : "text-gray-700 dark:text-yellow-900",
              )}
            >
              {category}
            </Button>

            {selectedCategory === category && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
