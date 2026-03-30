import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import CustomerLayout from '@/components/layout/CustomerLayout'
import AdminLayout from '@/components/layout/AdminLayout'
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

const isPreviewMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

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

      {/* Preview mode nav — lets you tap through all screens */}
      {isPreviewMode && (
        <div className="max-w-3xl mx-auto px-4 pb-12">
          <div className="bg-graphite border border-forest/30 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-forest uppercase tracking-wider mb-4">Preview Mode — All Screens</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link to="/portal"><Button variant="secondary" size="sm" className="w-full">Customer Portal</Button></Link>
              <Link to="/portal/orders"><Button variant="secondary" size="sm" className="w-full">My Orders</Button></Link>
              <Link to="/portal/orders/new"><Button variant="secondary" size="sm" className="w-full">New Order Form</Button></Link>
              <Link to="/portal/orders/demo"><Button variant="secondary" size="sm" className="w-full">Order Detail</Button></Link>
              <Link to="/admin"><Button variant="secondary" size="sm" className="w-full">Admin Dashboard</Button></Link>
              <Link to="/admin/orders"><Button variant="secondary" size="sm" className="w-full">Admin Orders</Button></Link>
              <Link to="/admin/orders/demo"><Button variant="secondary" size="sm" className="w-full">Admin Order Detail</Button></Link>
              <Link to="/login"><Button variant="secondary" size="sm" className="w-full">Login Page</Button></Link>
              <Link to="/signup"><Button variant="secondary" size="sm" className="w-full">Signup Page</Button></Link>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-smoke py-8 text-center">
        <p className="text-xs text-white/20">
          <span className="text-forest font-bold">STRAGE</span> Clothing &middot; Sialkot, Pakistan &middot; Sustainable Sportswear
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/signup/*" element={<SignupPage />} />

        {/* Customer portal — no auth guard in preview mode */}
        <Route path="/portal" element={<CustomerLayout />}>
          <Route index element={<PortalPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/new" element={<NewOrderPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
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
