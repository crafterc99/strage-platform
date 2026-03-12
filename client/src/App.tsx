import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import Navbar from '@/components/layout/Navbar'
import CustomerLayout from '@/components/layout/CustomerLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminRoute from '@/components/auth/AdminRoute'
import ToastContainer from '@/components/ui/ToastContainer'
import Button from '@/components/ui/Button'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'

// Customer pages
import PortalPage from '@/pages/customer/PortalPage'
import OrderListPage from '@/pages/customer/OrderListPage'
import OrderDetailPage from '@/pages/customer/OrderDetailPage'
import NewOrderPage from '@/pages/customer/NewOrderPage'

// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminOrderListPage from '@/pages/admin/OrderListPage'
import AdminOrderDetailPage from '@/pages/admin/OrderDetailPage'

import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-charcoal">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          <span className="text-forest">STRAGE</span>
        </h1>
        <p className="text-xl sm:text-2xl text-white/60 font-semibold mb-2">
          Sustainable Sportswear, Made Right.
        </p>
        <p className="text-sm text-white/30 uppercase tracking-[0.3em] mb-12">
          Quality &middot; Sustainability &middot; Performance
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Log In</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Custom Orders', desc: 'Design your sportswear from scratch — jerseys, tracksuits, hoodies, and more.' },
            { title: 'Track Progress', desc: 'Follow your order through every stage, from production to delivery.' },
            { title: 'Direct Communication', desc: 'Chat directly with our team. No middlemen, no delays.' },
          ].map((f) => (
            <div key={f.title} className="bg-graphite border border-smoke rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-smoke py-8 text-center">
        <p className="text-xs text-white/20">
          <span className="text-forest font-bold">STRAGE</span> Clothing &middot; Sialkot, Pakistan &middot; Sustainable Sportswear
        </p>
      </div>
    </div>
  )
}

function AuthSync() {
  const { getToken } = useAuth()
  const fetchDbUser = useAuthStore((s) => s.fetchDbUser)

  useEffect(() => {
    api.setTokenGetter(() => getToken())
    fetchDbUser()
  }, [getToken, fetchDbUser])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthSync />
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/signup/*" element={<SignupPage />} />

        {/* Customer portal */}
        <Route path="/portal" element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<PortalPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/new" element={<NewOrderPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrderListPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
