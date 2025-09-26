import { DynamicIsland } from "@/components/dynamic-island"

export default function DynamicIslandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dynamic Island Animation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A sleek, minimal Dynamic Island animation that smoothly expands, contracts, and morphs with elastic easing.
            Watch it cycle through different states automatically.
          </p>
        </div>

        <div className="relative h-96 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900" />
          <DynamicIsland />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-sm text-muted-foreground mb-2">States cycle automatically:</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Compact</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Notification</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">Music</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">Expanded</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Smooth elastic transitions</li>
              <li>• Multiple interactive states</li>
              <li>• Music player controls</li>
              <li>• Notification display</li>
              <li>• iOS 17+ inspired design</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Interactions</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Click play/pause in music mode</li>
              <li>• Heart button to like songs</li>
              <li>• Automatic state cycling</li>
              <li>• Responsive animations</li>
              <li>• Glossy depth effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
