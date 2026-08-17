import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, PawPrint, ScanSearch, BrainCircuit, History, LayoutDashboard, Home } from 'lucide-react';
import BackendStatus from './BackendStatus';
import { useBackendHealth } from '@/hooks/useBackendHealth';

const links = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/recognize', label: 'Recognize', Icon: ScanSearch },
  { to: '/model', label: 'Deep Learning Model', Icon: BrainCircuit },
  { to: '/history', label: 'History', Icon: History },
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { status, lastChecked, refresh } = useBackendHealth();

  return (
    <header className="sticky top-0 z-50 border-b border-forest-100/80 bg-forest-50/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-600 text-white shadow-soft">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-700 leading-tight text-forest-800 sm:text-lg">
            Species<span className="text-teal-600">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-soft'
                    : 'text-forest-700 hover:bg-forest-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <BackendStatus status={status} lastChecked={lastChecked} onRefresh={refresh} compact />
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl text-forest-700 ring-1 ring-forest-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
          className={`overflow-hidden border-t border-forest-100 bg-forest-50/95 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden ${
            open ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-forest-600 text-white' : 'text-forest-700 hover:bg-forest-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <div className="mt-2">
              <BackendStatus status={status} lastChecked={lastChecked} onRefresh={refresh} />
            </div>
          </div>
        </div>
    </header>
  );
}
