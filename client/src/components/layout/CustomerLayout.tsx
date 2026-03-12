import { Outlet, NavLink } from 'react-router-dom'
import { ClipboardDocumentListIcon, PlusCircleIcon, HomeIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const NAV_LINKS = [
  { to: '/portal', icon: HomeIcon, label: 'Dashboard', end: true },
  { to: '/portal/orders', icon: ClipboardDocumentListIcon, label: 'My Orders' },
  { to: '/portal/orders/new', icon: PlusCircleIcon, label: 'New Order' },
]

export default function CustomerLayout() {
  return (
    <div className="flex">
      <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-64px)] bg-graphite border-r border-smoke p-4">
        <nav className="space-y-1">
          {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
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
