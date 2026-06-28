import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiBarChart2, FiSettings, FiInfo, FiZap } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Test', icon: FiZap },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/statistics', label: 'Stats', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
  { to: '/about', label: 'About', icon: FiInfo },
];

export function Navbar() {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-20 bg-surface-card border-r border-surface-border z-50 items-center py-8 gap-2">
        <div className="mb-8">
          <FiActivity className="text-brand w-7 h-7" />
        </div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  isActive ? 'text-brand' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-brand/10 rounded-xl"
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-[10px] font-medium relative z-10">{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-surface-border z-50 flex justify-around py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-brand' : 'text-gray-500'
              }`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
