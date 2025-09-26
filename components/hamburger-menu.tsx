"use client"
import { X, Home, Search, Heart, User, Settings, HelpCircle, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { useRouter } from "next/navigation"

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
  onLoginOpen: () => void // Added onLoginOpen prop to trigger login modal from parent
}

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", action: "wishlist" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
]

export function HamburgerMenu({ isOpen, onClose, onLoginOpen }: HamburgerMenuProps) {
  const { user, logout, isDarkMode, toggleDarkMode, wishlist } = useCartStore()
  const router = useRouter()

  const handleWelcomeClick = () => {
    console.log("[v0] Welcome click - user:", user) // Added debug logging
    if (!user) {
      console.log("[v0] Opening login modal") // Added debug logging
      onLoginOpen() // Use parent's login handler instead of local state
      onClose() // Close hamburger menu immediately
    }
  }

  const handleMenuItemClick = (item: any) => {
    if (item.action === "wishlist") {
      router.push("/wishlist")
    } else {
      router.push(item.href)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0">
      <div className="fixed inset-y-0 left-0 w-80 bg-background border-r border-border shadow-2xl animate-in slide-in-from-left-4 duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Menu</h2>
              <p className="text-sm text-muted-foreground">Navigate your experience</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div
            className={cn(
              "p-6 border-b border-border transition-colors duration-200",
              !user && "cursor-pointer hover:bg-muted/50",
            )}
            onClick={handleWelcomeClick}
          >
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full p-3">
                {user?.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-6 w-6 rounded-full" />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{user ? `Hello, ${user.name}!` : "Welcome back!"}</h3>
                <p className={cn("text-sm", user ? "text-muted-foreground" : "text-primary hover:text-primary/80")}>
                  {user ? user.email : "Sign in to continue"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-lg h-11 text-foreground",
                    "hover:bg-muted transition-colors duration-200",
                    "animate-in slide-in-from-left-2",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleMenuItemClick(item)}
                >
                  <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                  {item.label}
                  {item.action === "wishlist" && wishlist.length > 0 && (
                    <span className="ml-auto bg-muted text-muted-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              ))}

              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-lg h-11 text-foreground",
                  "hover:bg-muted transition-colors duration-200",
                  "animate-in slide-in-from-left-2",
                )}
                style={{ animationDelay: `${menuItems.length * 50}ms` }}
                onClick={() => {
                  toggleDarkMode()
                  onClose()
                }}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 mr-3 text-muted-foreground" />
                ) : (
                  <Moon className="h-5 w-5 mr-3 text-muted-foreground" />
                )}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>
            </nav>
          </div>

          {user && (
            <div className="p-6 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-lg h-11 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                onClick={() => {
                  logout()
                  onClose()
                }}
              >
                <User className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
