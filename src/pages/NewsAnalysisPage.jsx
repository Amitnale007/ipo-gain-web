import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  CalendarDays,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ArrowLeft,
  ChartNoAxesCombined,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getNewsAnalysis, getNewsAnalysisDates } from '../api/newsApi';

const today = () =>
  new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });

export default function NewsAnalysisPage() {
  const [date, setDate] = useState(today());
  const [stockQuery, setStockQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [impactFilter, setImpactFilter] = useState('all');

  // Load available analysis dates on mount
  useEffect(() => {
    getNewsAnalysisDates()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAvailableDates(res.data);
          // If today has no records but dates are available, pick the most recent date
          if (res.data.length > 0 && !res.data.includes(today())) {
            setDate(res.data[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  async function fetchNews(targetDate = date, targetStock = stockQuery) {
    setLoading(true);
    setError('');

    try {
      const res = await getNewsAnalysis({
        date: targetDate || undefined,
        stock: targetStock || undefined,
      });

      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setRecords([]);
      setError(err.message || 'Unable to fetch news analysis');
    } finally {
      setLoading(false);
    }
  }

  // Flatten all stocks from retrieved records
  const allStocks = records.flatMap((rec) =>
    (rec.stocks ?? []).map((stock, idx) => ({
      ...stock,
      analysis_date: rec.analysis_date,
      key: `${rec._id || rec.analysis_date}-${stock.stock_name}-${idx}`,
    }))
  );

  // Filter stocks by sentiment
  const filteredStocks = allStocks.filter((s) => {
    if (impactFilter === 'all') return true;
    return (s.impact || '').toLowerCase() === impactFilter;
  });

  // Calculate sentiment metrics
  const positiveCount = allStocks.filter(
    (s) => (s.impact || '').toLowerCase() === 'positive'
  ).length;
  const negativeCount = allStocks.filter(
    (s) => (s.impact || '').toLowerCase() === 'negative'
  ).length;
  const neutralCount = allStocks.filter(
    (s) => (s.impact || '').toLowerCase() === 'neutral'
  ).length;

  const impactBadge = (impact = '') => {
    const val = impact.toLowerCase();
    if (val === 'positive') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <TrendingUp size={13} />
          Positive
        </span>
      );
    }
    if (val === 'negative') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
          <TrendingDown size={13} />
          Negative
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
        <Minus size={13} />
        Neutral
      </span>
    );
  };

  const directionBadge = (dir = '') => {
    const val = dir.toLowerCase();
    if (val === 'up') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <ArrowUpRight size={14} className="text-emerald-600" />
          Direction: Up
        </span>
      );
    }
    if (val === 'down') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700">
          <ArrowDownRight size={14} className="text-rose-600" />
          Direction: Down
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        <Minus size={14} className="text-slate-400" />
        Direction: Neutral
      </span>
    );
  };

  return (
    <div className="space-y-7">
      {/* ── Sub-nav breadcrumbs ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        <Link
          to="/ipo"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <ChartNoAxesCombined size={14} />
          Switch to IPO Analysis →
        </Link>
      </div>

      {/* ── Search Hero ── */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sky-200">
              <Sparkles size={17} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Corporate Developments
              </span>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Daily Stock News Analysis
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
              Review daily stock sentiment, earnings results, order books, and
              market direction forecasts.
            </p>

            {/* Quick Available Dates Chips */}
            {availableDates.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-indigo-200">Recent dates:</span>
                {availableDates.slice(0, 5).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDate(d);
                      fetchNews(d, stockQuery);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      date === d
                        ? 'bg-white text-indigo-900 shadow-sm'
                        : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="flex flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              fetchNews();
            }}
          >
            <label className="flex items-center gap-2 px-2 text-slate-500">
              <CalendarDays size={19} className="text-slate-400 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="min-w-0 bg-white py-1.5 text-sm text-slate-900 outline-none"
              />
            </label>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2 px-2 text-slate-500">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Filter stock (e.g. IRCTC)"
                value={stockQuery}
                onChange={(e) => setStockQuery(e.target.value)}
                className="w-full sm:w-44 bg-white py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={17} />
              ) : (
                <Search size={17} />
              )}
              {loading ? 'Searching' : 'Find News'}
            </button>
          </form>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* ── Summary Stats ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total Stocks',
            value: allStocks.length,
            note: date ? `Analysis for ${date}` : 'All returned records',
            icon: <Layers />,
            color: 'bg-indigo-50 text-indigo-600',
          },
          {
            label: 'Positive Impact',
            value: positiveCount,
            note: 'Bullish outlook & strong earnings',
            icon: <TrendingUp />,
            color: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Negative Impact',
            value: negativeCount,
            note: 'Earnings misses or rising debt',
            icon: <TrendingDown />,
            color: 'bg-rose-50 text-rose-600',
          },
          {
            label: 'Neutral / Mixed',
            value: neutralCount,
            note: 'Flat results or mixed reactions',
            icon: <Minus />,
            color: 'bg-amber-50 text-amber-600',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${card.color}`}>{card.icon}</div>
            </div>
            <p className="mt-3 truncate text-xs text-slate-500">{card.note}</p>
          </div>
        ))}
      </section>

      {/* ── Filter Tabs & Section Header ── */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold">News & Impact Reports</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {date ? `Analysis Date: ${date}` : 'All records'} •{' '}
              {filteredStocks.length} stock{filteredStocks.length === 1 ? '' : 's'}{' '}
              shown
            </p>
          </div>

          {/* Sentiment Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm text-xs font-semibold">
            <span className="px-2 text-slate-400 flex items-center gap-1">
              <Filter size={13} />
              Filter:
            </span>
            {[
              { id: 'all', label: `All (${allStocks.length})` },
              { id: 'positive', label: `Positive (${positiveCount})` },
              { id: 'negative', label: `Negative (${negativeCount})` },
              { id: 'neutral', label: `Neutral (${neutralCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setImpactFilter(tab.id)}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  impactFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Empty State ── */}
        {!loading && !error && allStocks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Newspaper size={25} />
            </div>
            <h3 className="font-semibold text-slate-900">
              No news analysis loaded
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Pick a date or search a stock to load daily news analysis records
              from your database.
            </p>
          </div>
        )}

        {/* ── Stock Cards Grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStocks.map((stock) => (
            <article
              key={stock.key}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {stock.stock_name}
                  </h3>
                  {impactBadge(stock.impact)}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {directionBadge(stock.stock_direction)}
                  {stock.analysis_date && (
                    <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      {stock.analysis_date}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {stock.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-5 text-center text-xs leading-5 text-slate-500">
        Daily news impacts and direction indicators are based on market analysis
        records. Verify company disclosures and filings before trading.
      </footer>
    </div>
  );
}

