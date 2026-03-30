import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

const isPreviewMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 bg-charcoal/95 backdrop-blur-md border-b border-smoke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-forest">STRAGE</span>
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Clothing</span>
          </Link>

          <div className="flex items-center gap-4">
            {isPreviewMode ? (
              <div className="flex items-center gap-3">
                <Link to="/portal" className="text-sm text-white/60 hover:text-white transition-colors">Portal</Link>
                <Link to="/admin" className="text-sm text-white/60 hover:text-white transition-colors">Admin</Link>
                <Link to="/portal/orders/new">
                  <Button size="sm">New Order</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
