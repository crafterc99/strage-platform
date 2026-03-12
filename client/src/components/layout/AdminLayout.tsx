import { Outlet, NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

const ADMIN_LINKS = [
  { to: '/admin', icon: HomeIcon, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ClipboardDocumentListIcon, label: 'Orders' },
  { to: '/admin/customers', icon: UsersIcon, label: 'Customers' },
  { to: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
]

export default function AdminLayout() {
  return (
    <div className="flex">
      <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-64px)] bg-graphite border-r border-smoke p-4">
        <div className="px-3 py-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest">Admin Panel</span>
        </div>
        <nav className="space-y-1">
          {ADMIN_LINKS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive ? 'bg-forest/15 text-emerald' : 'text-white/60 hover:text-white hover:bg-smoke/50'
                )
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
