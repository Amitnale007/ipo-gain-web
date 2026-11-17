import { Link } from 'react-router-dom';
import {
  ChartNoAxesCombined,
  Newspaper,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Activity,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-6 py-14 text-white shadow-xl sm:px-12 sm:py-20">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-200 backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-300" />
            Indian Financial Market Research
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-tight">
            Smart Market Analysis, <br />
            <span className="bg-gradient-to-r from-indigo-200 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Simplified for You
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-indigo-100/90 sm:text-base">
            Choose between in-depth IPO evaluations with GMP and valuation scores, or track daily corporate news and stock earnings impact.
          </p>

          {/* ── Two Primary Choice Buttons ── */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/ipo"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 hover:shadow-indigo-500/50 sm:w-auto"
            >
              <ChartNoAxesCombined size={18} />
              See IPO Analysis
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/news"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
            >
              <Newspaper size={18} />
              See News Analysis
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </section>

      {/* ── Main 2 Module Cards ── */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Module 1: IPO Analysis */}
        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-indigo-300 hover:shadow-md sm:p-9">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <ChartNoAxesCombined size={28} />
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                Primary Market
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
              IPO Analysis
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-600">
              Comprehensive valuation, subscription metrics, GMP, and AI-driven score breakdown out of 100 for Indian IPOs closing on selected dates.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <TrendingUp size={15} className="text-indigo-600 shrink-0" />
                <span>8-point category score breakdown (Financials, Valuation, Quality, Demand)</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity size={15} className="text-indigo-600 shrink-0" />
                <span>Live Grey Market Premium (GMP) & subscription tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-indigo-600 shrink-0" />
                <span>Clear investment recommendations: Apply, Avoid, or Neutral</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              to="/ipo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
            >
              <span>Explore IPO Analysis</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Module 2: News Analysis */}
        <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-9">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                <Newspaper size={28} />
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                Daily Stocks
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
              Daily News Analysis
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-600">
              Real-time daily stock impact reports analyzing quarterly earnings, corporate developments, order books, and expected price directions.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Layers size={15} className="text-sky-600 shrink-0" />
                <span>Stock-by-stock impact categorized as Positive, Negative, or Neutral</span>
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp size={15} className="text-sky-600 shrink-0" />
                <span>Projected direction indicators (Up, Down, Sideways)</span>
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays size={15} className="text-sky-600 shrink-0" />
                <span>Search and review by date or filter specific stock names</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              to="/news"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
            >
              <span>Explore News Analysis</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

