import { useState, useEffect, useMemo } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Header } from "./components/Header";
import { Disclaimer } from "./components/Disclaimer";
import {
  PreHarvestingCard,
  AfterHarvestingCard,
} from "./components/GainsCards";
import { HoldingsTable } from "./components/HoldingsTable";
import { fetchHoldings, fetchCapitalGains } from "./lib/data";
import type { Holding, CapitalGainsData } from "./lib/data";

function AppContent() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGainsData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [holdingsData, gainsData] = await Promise.all([
          fetchHoldings(),
          fetchCapitalGains(),
        ]);
        setHoldings(holdingsData);
        setCapitalGains(gainsData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  function toggleHolding(id: string) {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelectedIds(new Set(holdings.map((h) => h.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  const afterHarvestingGains = useMemo(() => {
    if (!capitalGains) return null;

    const base = capitalGains.capitalGains;

    // Start with the pre-harvesting numbers
    let stProfits = base.stcg.profits;
    let stLosses = base.stcg.losses;
    let ltProfits = base.ltcg.profits;
    let ltLosses = base.ltcg.losses;

    // Add gains/losses from selected holdings
    for (const holding of holdings) {
      if (!selectedIds.has(holding.id)) continue;

      // Short-term gain
      if (holding.stcg.gain > 0) stProfits += holding.stcg.gain;
      if (holding.stcg.gain < 0) stLosses += Math.abs(holding.stcg.gain);

      // Long-term gain
      if (holding.ltcg.gain > 0) ltProfits += holding.ltcg.gain;
      if (holding.ltcg.gain < 0) ltLosses += Math.abs(holding.ltcg.gain);
    }

    return { stProfits, stLosses, ltProfits, ltLosses };
  }, [selectedIds, holdings, capitalGains]);

  // Pre-harvesting total realised gains
  const preRealisedGains = capitalGains
    ? capitalGains.capitalGains.stcg.profits -
      capitalGains.capitalGains.stcg.losses +
      (capitalGains.capitalGains.ltcg.profits -
        capitalGains.capitalGains.ltcg.losses)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-9 h-9 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your portfolio…</p>
        </div>
      </div>
    );
  }

  if (error || !capitalGains) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gains = capitalGains.capitalGains;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-slate-100">
      {/* Top navigation bar */}
      <Header />

      <main className="max-w-[1140px] mx-auto px-6 pt-7 pb-16">
        {/* Page heading */}
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-xl font-bold">Tax Harvesting</h1>

          {/* "How it works?" tooltip - appears on hover */}
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="text-[13px] text-blue-600 font-medium cursor-default">
              How it works?
            </span>

            {/* Tooltip box - only visible on hover */}
            {showTooltip && (
              <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-slate-800 text-slate-300 text-[13px] leading-relaxed rounded-xl py-3.5 px-4 w-[300px] shadow-[0_8px_24px_rgba(0,0,0,0.25)] z-50 pointer-events-none">
                {/* Small arrow at top of tooltip */}
                <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-slate-800" />
                Tax-loss harvesting is a strategy of selling assets at a loss to
                offset capital gains, reducing your overall tax liability.
                Select holdings below to see how much you can save.
              </div>
            )}
          </div>
        </div>

        {/* Important notes accordion */}
        <div className="mb-5">
          <Disclaimer />
        </div>

        {/* Pre & After Harvesting cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <PreHarvestingCard
            stProfits={gains.stcg.profits}
            stLosses={gains.stcg.losses}
            ltProfits={gains.ltcg.profits}
            ltLosses={gains.ltcg.losses}
          />
          {afterHarvestingGains && (
            <AfterHarvestingCard
              stProfits={afterHarvestingGains.stProfits}
              stLosses={afterHarvestingGains.stLosses}
              ltProfits={afterHarvestingGains.ltProfits}
              ltLosses={afterHarvestingGains.ltLosses}
              preRealisedGains={preRealisedGains}
            />
          )}
        </div>

        {/* Holdings table */}
        <HoldingsTable
          holdings={holdings}
          selectedIds={selectedIds}
          onToggle={toggleHolding}
          onToggleAll={toggleAll}
        />
      </main>
    </div>
  );
}

// ROOT EXPORT — wraps everything in ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      {/* Root wrapper needs dynamic dark class for Tailwind v4 to pick it up based on our state */}
      <AppRoot />
    </ThemeProvider>
  );
}

// Separate wrapper to access useTheme easily and toggle body class
function AppRoot() {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return <AppContent />;
}
