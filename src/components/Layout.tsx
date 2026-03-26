import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Heart, User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/groups', icon: Users, label: 'Groups' },
  { to: '/prayer', icon: Heart, label: 'Prayer' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto relative">
      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-[#1E3A5F]/10 safe-bottom z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#1E3A5F]'
                    : 'text-[#1E3A5F]/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-[#C9A853]' : ''}
                  />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-[#1E3A5F]' : 'text-[#1E3A5F]/40'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
