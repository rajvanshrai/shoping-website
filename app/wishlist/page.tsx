"use client"

import { useCartStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useCartStore()

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">Save items you love for later</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted/50 rounded-full p-6 mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Link href="/">
              <Button className="rounded-full px-8">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {wishlist.length > 0 && (
            <Button variant="outline" onClick={() => clearWishlist()} className="rounded-full">
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
