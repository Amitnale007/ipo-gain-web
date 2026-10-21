
import { useState } from 'react';
import {
  Search, TrendingUp, Building2, CalendarDays, IndianRupee,
  ChartNoAxesCombined, AlertTriangle, ExternalLink, RefreshCw,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const today = () =>
  new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });

const money = (value) => {
  if (value == null || value === '') return 'N/A';
  return typeof value === 'number'
    ? `₹${value.toLocaleString('en-IN')}`
    : value;
};

function scoreColor(score = 0) {
  if (score >= 75) return 'text-emerald-700 bg-emerald-50';
  if (score >= 60) return 'text-amber-700 bg-amber-50';
  return 'text-rose-700 bg-rose-50';
}

function App() {
  const [date, setDate] = useState(today());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  async function searchIPOs() {
    setLoading(true);
    setError('');
    setExpanded(null);

    try {
      const response = await fetch(
        `${API_URL}/api/ipo?date=${encodeURIComponent(date)}`
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to fetch IPO data');
      }

      setRecords(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setRecords([]);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const analyses = records.flatMap((record) => {
    const result = record.result ?? record;
    return (result.ipos ?? []).map((ipo, index) => ({
      ...ipo,
      analysisId: record._id,
      key: `${record._id}-${ipo.symbol ?? ipo.company_name}-${index}`,
      requestedDate: record.requested_close_date,
    }));
  });

  const latestRecord = records[0];
  const latestResult = latestRecord?.result ?? latestRecord;
  const total = latestResult?.ipo_count ?? analyses.length;
  const averageScore = analyses.length
    ? Math.round(
        analyses.reduce((sum, ipo) => sum + (Number(ipo.overall_score) || 0), 0)
        / analyses.length
      )
    : 0;
  const bestIPO = [...analyses].sort(
    (a, b) => (b.overall_score ?? 0) - (a.overall_score ?? 0)
  )[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
              <ChartNoAxesCombined size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                IPO Insights
              </h1>
              <p className="text-sm text-slate-500">
                Indian IPO research and analysis
              </p>
            </div>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <span className="mr-2 mt-1 h-2 w-2 rounded-full bg-emerald-500" />
            Analysis dashboard
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 lg:px-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-indigo-200">
                <Sparkles size={17} />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Market research
                </span>
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Discover IPO opportunities
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                Compare IPO scores, financial strength, valuations, demand,
                and key investment risks by closing date.
              </p>
            </div>

            <form
              className="flex flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                searchIPOs();
              }}
            >
              <label className="flex items-center gap-2 px-2 text-slate-500">
                <CalendarDays size={19} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="min-w-0 bg-white py-2 text-sm text-slate-900 outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="animate-spin" size={17} /> : <Search size={17} />}
                {loading ? 'Searching' : 'Find IPOs'}
              </button>
            </form>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Saved analyses',
              value: records.length,
              note: 'Analysis records for selected date',
              icon: <Building2 />,
              color: 'bg-indigo-50 text-indigo-600',
            },
            {
              label: 'IPOs analyzed',
              value: total,
              note: 'From the latest saved analysis',
              icon: <ChartNoAxesCombined />,
              color: 'bg-sky-50 text-sky-600',
            },
            {
              label: 'Average score',
              value: analyses.length ? `${averageScore}/100` : '—',
              note: 'Across returned IPO entries',
              icon: <TrendingUp />,
              color: 'bg-emerald-50 text-emerald-600',
            },
            {
              label: 'Highest rated',
              value: bestIPO ? `${bestIPO.overall_score}/100` : '—',
              note: bestIPO?.company_name ?? 'Search for a date',
              icon: <Sparkles />,
              color: 'bg-amber-50 text-amber-600',
            },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-3 text-2xl font-bold tracking-tight">{card.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${card.color}`}>{card.icon}</div>
              </div>
              <p className="mt-3 truncate text-xs text-slate-500">{card.note}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">IPO analysis results</h2>
              <p className="mt-1 text-sm text-slate-500">
                Closing date: {date || 'Not selected'}
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
              {analyses.length} IPO{analyses.length === 1 ? '' : 's'} found
            </span>
          </div>

          {!loading && !error && records.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Search size={25} />
              </div>
              <h3 className="font-semibold">No analysis loaded</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Select an IPO closing date and click Find IPOs to retrieve saved analysis from your database.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {analyses.map((ipo) => {
              const isExpanded = expanded === ipo.key;
              const breakdown = ipo.score_breakdown ?? {};

              return (
                <article
                  key={ipo.key}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <Building2 size={23} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold">{ipo.company_name}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-600">
                              {ipo.ipo_type ?? 'IPO'}
                            </span>
                            <span className="text-xs text-slate-500">
                              Closes {ipo.close_date ?? 'N/A'}
                            </span>
                            {ipo.symbol && (
                              <span className="text-xs text-slate-500">
                                Symbol: {ipo.symbol}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <div className={`rounded-xl px-4 py-3 text-center ${scoreColor(ipo.overall_score)}`}>
                          <p className="text-2xl font-extrabold">{ipo.overall_score ?? '—'}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider">Score / 100</p>
                        </div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          ipo.recommendation?.toLowerCase() === 'apply'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ipo.recommendation?.toLowerCase() === 'avoid'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                        }`}>
                          {ipo.recommendation ?? 'Not rated'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {[
                        ['Issue price', money(ipo.issue_price)],
                        ['Issue size', ipo.issue_size ?? 'N/A'],
                        ['P/E ratio', ipo.valuation?.pe_ratio ?? 'N/A'],
                        ['Subscription', ipo.subscription?.total_times != null
                          ? `${ipo.subscription.total_times}×`
                          : 'N/A'],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium text-slate-500">{label}</p>
                          <p className="mt-2 break-words text-sm font-bold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <IndianRupee size={15} />
                          GMP: {ipo.gmp?.amount != null ? money(ipo.gmp.amount) : 'N/A'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} />
                          Listing: {ipo.listing_date ?? 'N/A'}
                        </span>
                      </div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : ipo.key)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        {isExpanded ? 'Hide details' : 'View full analysis'}
                        {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-5 space-y-6 border-t border-slate-200 pt-5">
                        <div>
                          <h4 className="mb-3 font-bold">Score breakdown</h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(breakdown).map(([key, item]) => (
                              <div key={key} className="rounded-xl border border-slate-200 p-3">
                                <div className="flex justify-between gap-3 text-sm">
                                  <span className="font-medium capitalize text-slate-700">
                                    {key.replaceAll('_', ' ')}
                                  </span>
                                  <span className="shrink-0 font-bold">
                                    {item.score}/{item.max_score}
                                  </span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-indigo-600"
                                    style={{
                                      width: `${Math.min(100, Math.max(0, (item.score / item.max_score) * 100))}%`,
                                    }}
                                  />
                                </div>
                                {item.reason && (
                                  <p className="mt-2 text-xs leading-5 text-slate-500">{item.reason}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="rounded-xl bg-emerald-50 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-emerald-800">
                              <TrendingUp size={17} /> Key strengths
                            </h4>
                            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-5 text-emerald-900">
                              {(ipo.key_strengths ?? []).map((item) => <li key={item}>{item}</li>)}
                              {!ipo.key_strengths?.length && <li>No strengths provided.</li>}
                            </ul>
                          </div>
                          <div className="rounded-xl bg-rose-50 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-rose-800">
                              <AlertTriangle size={17} /> Key risks
                            </h4>
                            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-5 text-rose-900">
                              {(ipo.key_risks ?? []).map((item) => <li key={item}>{item}</li>)}
                              {!ipo.key_risks?.length && <li>No risks provided.</li>}
                            </ul>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <h4 className="mb-2 font-bold">Financial summary</h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(ipo.financial_summary ?? {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between gap-3 border-b border-slate-100 py-2">
                                  <span className="capitalize text-slate-500">{key.replaceAll('_', ' ')}</span>
                                  <span className="text-right font-medium">{value ?? 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-2 font-bold">Demand and valuation</h4>
                            <div className="space-y-2 text-sm">
                              {[
                                ['QIB subscription', ipo.subscription?.qib_times],
                                ['NII subscription', ipo.subscription?.nii_times],
                                ['Retail subscription', ipo.subscription?.retail_times],
                                ['GMP percentage', ipo.gmp?.percentage != null ? `${ipo.gmp.percentage}%` : null],
                                ['Valuation view', ipo.valuation?.valuation_assessment],
                                ['Peer comparison', ipo.valuation?.peer_comparison],
                              ].map(([label, value]) => (
                                <div key={label} className="flex justify-between gap-3 border-b border-slate-100 py-2">
                                  <span className="text-slate-500">{label}</span>
                                  <span className="text-right font-medium">{value ?? 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {ipo.sources?.length > 0 && (
                          <div>
                            <h4 className="mb-2 font-bold">Research sources</h4>
                            <div className="flex flex-wrap gap-2">
                              {ipo.sources.map((url) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex max-w-full items-center gap-2 break-all rounded-lg border border-slate-200 px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50"
                                >
                                  <ExternalLink size={14} className="shrink-0" />
                                  {new URL(url).hostname}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-slate-200 py-5 text-center text-xs leading-5 text-slate-500">
          IPO scores are based on saved research data, not guaranteed returns.
          Verify company filings and market information before investing.
        </footer>
      </main>
    </div>
  );
}

export default App;
