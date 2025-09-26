"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Menu, Filter, Grid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { CategoryTabs } from "@/components/category-tabs"
import { CartDrawer } from "@/components/cart-drawer"
import { CartDock } from "@/components/cart-dock"
import { SearchBar } from "@/components/search-bar"
import { SwipeHandler } from "@/components/swipe-handler"
import { LoadingGrid } from "@/components/loading-skeleton"
import { FilterModal } from "@/components/filter-modal"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { LoginModal } from "@/components/login-modal" // Added LoginModal import
import { products } from "@/lib/products"
import { GlowMenu } from "@/components/glow-menu"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false) // Added login modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 100] as [number, number],
    categories: ["All"],
    sortBy: "popular",
    inStock: true,
  })

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesStock = !filters.inStock || product.stock > 0

      return matchesCategory && matchesSearch && matchesPrice && matchesStock
    })

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default: // popular
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    }

    return filtered
  }, [selectedCategory, searchQuery, filters])

  const handleCategoryChange = (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)
    setTimeout(() => setIsLoading(false), 800)
  }

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }

  const handleCloseProductDetail = () => {
    setIsProductDetailOpen(false)
    setSelectedProduct(null)
  }

  return (
    <SwipeHandler>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center">
                  <svg
                    width="60"
                    height="40"
                    viewBox="0 0 60 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M30 5C25 5 20 8 15 12C10 16 5 22 5 30C5 35 8 38 12 38C16 38 20 35 25 32C27 30 28 28 30 28C32 28 33 30 35 32C40 35 44 38 48 38C52 38 55 35 55 30C55 22 50 16 45 12C40 8 35 5 30 5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M20 15C18 17 16 20 16 24C16 26 17 27 18 27C19 27 20 26 20 24C20 20 20 17 20 15Z"
                      fill="background"
                    />
                    <path
                      d="M40 15C40 17 40 20 40 24C40 26 41 27 42 27C43 27 44 26 44 24C44 20 42 17 40 15Z"
                      fill="background"
                    />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Snack Cave</p>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <DarkModeToggle className="rounded-full hover:bg-muted" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex rounded-full hover:bg-muted"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                >
                  {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
          {/* Search */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onKeyPress={handleSearchKeyPress} />
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          </div>

          {/* Collections Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{selectedCategory} Collections</h2>
              <span className="text-sm font-normal text-muted-foreground">({filteredProducts.length} items)</span>
            </div>
            <Button variant="ghost" className="hidden sm:flex text-primary hover:bg-primary/10">
              View All →
            </Button>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <LoadingGrid count={8} />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-bubble"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full p-6 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Try adjusting your search or browse different categories.
              </p>
            </div>
          )}
        </main>

        {/* Cart Dock */}
        <CartDock />

        <GlowMenu />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Modal Components */}
        <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} />

        <HamburgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onLoginOpen={() => setIsLoginOpen(true)} // Pass login handler to hamburger menu
        />

        <ProductDetailModal product={selectedProduct} isOpen={isProductDetailOpen} onClose={handleCloseProductDetail} />

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </SwipeHandler>
  )
}
