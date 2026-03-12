import { Link } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/react'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="sticky top-0 z-30 bg-charcoal/95 backdrop-blur-md border-b border-smoke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isSignedIn ? '/portal' : '/'} className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-forest">STRAGE</span>
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Clothing</span>
          </Link>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/portal" className="text-sm text-white/60 hover:text-white transition-colors">
                  Portal
                </Link>
                <UserButton />
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
