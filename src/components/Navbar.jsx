import { NavLink, Link } from 'react-router-dom';
import { ChartNoAxesCombined, Newspaper, Home } from 'lucide-react';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="rounded-xl bg-indigo-600 p-2 text-white transition group-hover:bg-indigo-700">
            <ChartNoAxesCombined size={22} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Market Intelligence
            </span>
            <p className="text-xs text-slate-500">IPO & Stock News Research</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            <Home size={16} />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
          <NavLink to="/ipo" className={navLinkClass}>
            <ChartNoAxesCombined size={16} />
            <span>IPO Analysis</span>
          </NavLink>
          <NavLink to="/news" className={navLinkClass}>
            <Newspaper size={16} />
            <span>News Analysis</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

