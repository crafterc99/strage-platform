import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-sm text-white/50 mb-6">Clerk authentication will appear here when configured.</p>
        <div className="space-y-3 mb-6">
          <div className="bg-charcoal rounded-xl p-3 border border-smoke">
            <label className="text-xs text-white/40 block text-left mb-1">Full Name</label>
            <div className="h-10 bg-smoke/30 rounded-lg" />
          </div>
          <div className="bg-charcoal rounded-xl p-3 border border-smoke">
            <label className="text-xs text-white/40 block text-left mb-1">Email</label>
            <div className="h-10 bg-smoke/30 rounded-lg" />
          </div>
          <div className="bg-charcoal rounded-xl p-3 border border-smoke">
            <label className="text-xs text-white/40 block text-left mb-1">Password</label>
            <div className="h-10 bg-smoke/30 rounded-lg" />
          </div>
        </div>
        <Link to="/portal">
          <Button className="w-full">Create Account (Preview)</Button>
        </Link>
        <p className="text-xs text-white/30 mt-4">
          Already have an account? <Link to="/login" className="text-forest">Log in</Link>
        </p>
      </Card>
    </div>
  )
}
