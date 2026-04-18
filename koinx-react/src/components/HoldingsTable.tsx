import { useState } from "react";
import type { Holding } from "../lib/data";

type HoldingsTableProps = {
  holdings: Holding[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
};

function formatAmount(value: number): string {
  if (Math.abs(value) < 1e-10) return "0";
  if (Math.abs(value) >= 100000)
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (Math.abs(value) >= 1) return parseFloat(value.toFixed(5)).toString();
  return value.toPrecision(4);
}

function formatPrice(value: number): string {
  if (value >= 1000)
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (value >= 1)
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  if (value >= 0.001) return value.toFixed(6);
  return value.toPrecision(4);
}

function formatValue(value: number): string {
  if (value < 0.01) return "$ 0.00";
  return `$ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatGain(value: number): string {
  const sign = value < 0 ? "-" : "+";
  const abs = Math.abs(value);
  if (abs < 1e-10) return "+$0.00";
  const formatted =
    abs >= 1
      ? abs.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : abs.toPrecision(3);
  return `${sign}$${formatted}`;
}

export function HoldingsTable({
  holdings,
  selectedIds,
  onToggle,
  onToggleAll,
}: HoldingsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortField, setSortField] = useState<"stcg" | "ltcg" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sorting logic
  const sortedHoldings = [...holdings].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = sortField === "stcg" ? a.stcg.gain : a.ltcg.gain;
    const bValue = sortField === "stcg" ? b.stcg.gain : b.ltcg.gain;

    if (sortDirection === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  // How many rows to show
  const visibleRows = showAll ? sortedHoldings : sortedHoldings.slice(0, 4);

  // Are all rows selected?
  const allSelected =
    holdings.length > 0 && holdings.every((h) => selectedIds.has(h.id));
  const someSelected =
    holdings.some((h) => selectedIds.has(h.id)) && !allSelected;

  const handleSort = (field: "stcg" | "ltcg") => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Table title */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Holdings
        </h2>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full border-collapse">
          {/* Table header */}
          <thead>
            <tr>
              {/* Checkbox to select all */}
              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom w-[52px] pl-6">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(checked) => onToggleAll(checked)}
                />
              </th>

              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-left min-w-[160px]">
                Asset
              </th>

              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-right min-w-[150px]">
                <div className="font-medium">Holdings</div>
                <div className="text-[11px] font-normal mt-0.5">
                  Current Market Rate
                </div>
              </th>

              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-right min-w-[140px]">
                Total Current Value
              </th>

              <th
                className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-right min-w-[130px] cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-[#1c2233] transition-colors"
                onClick={() => handleSort("stcg")}
              >
                <div className="flex items-center justify-end gap-1">
                  Short-term
                  <div className="flex flex-col gap-[2px]">
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      className={`transition-opacity ${sortField === "stcg" && sortDirection === "asc" ? "opacity-100" : "opacity-30"}`}
                    >
                      <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      className={`transition-opacity ${sortField === "stcg" && sortDirection === "desc" ? "opacity-100" : "opacity-30"}`}
                    >
                      <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              <th
                className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-right min-w-[130px] cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-[#1c2233] transition-colors"
                onClick={() => handleSort("ltcg")}
              >
                <div className="flex items-center justify-end gap-1">
                  Long-Term
                  <div className="flex flex-col gap-[2px]">
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      className={`transition-opacity ${sortField === "ltcg" && sortDirection === "asc" ? "opacity-100" : "opacity-30"}`}
                    >
                      <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      className={`transition-opacity ${sortField === "ltcg" && sortDirection === "desc" ? "opacity-100" : "opacity-30"}`}
                    >
                      <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-right min-w-[120px] pr-6">
                Amount to Sell
              </th>
            </tr>
          </thead>

          {/* Table body rows */}
          <tbody>
            {visibleRows.map((holding) => {
              const isSelected = selectedIds.has(holding.id);
              const totalValue = holding.currentPrice * holding.totalHolding;

              return (
                <tr
                  key={holding.id}
                  onClick={() => onToggle(holding.id)}
                  className={`
                    cursor-pointer transition-colors duration-150
                    hover:bg-slate-50 dark:hover:bg-white/[0.02]
                    ${isSelected ? "bg-blue-50 dark:bg-[#162033]" : "bg-transparent"}
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle pl-6 w-[52px]">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggle(holding.id)}
                    />
                  </td>

                  {/* Asset name + logo */}
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={holding.logo}
                        alt={holding.coin}
                        className="w-8 h-8 rounded-full object-cover bg-slate-100 dark:bg-[#1e2535] shrink-0"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src =
                            "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                        }}
                      />
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {holding.coinName.length > 22
                            ? holding.coinName.slice(0, 22) + "…"
                            : holding.coinName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {holding.coin}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Holdings amount + price */}
                  <td
                    className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle text-right"
                    title={holding.totalHolding.toString()}
                  >
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {formatAmount(holding.totalHolding)} {holding.coin}
                    </div>
                    <div
                      className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5"
                      title={holding.averageBuyPrice.toString()}
                    >
                      $ {formatPrice(holding.averageBuyPrice)}/{holding.coin}
                    </div>
                  </td>

                  {/* Total current value */}
                  <td
                    className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle text-right font-medium text-slate-900 dark:text-slate-100"
                    title={totalValue.toString()}
                  >
                    {formatValue(totalValue)}
                  </td>

                  {/* Short-term gain */}
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle text-right">
                    <div
                      className={`font-semibold ${holding.stcg.gain < 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-500"}`}
                      title={holding.stcg.gain.toString()}
                    >
                      {formatGain(holding.stcg.gain)}
                    </div>
                    <div
                      className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5"
                      title={holding.stcg.balance.toString()}
                    >
                      {formatAmount(holding.stcg.balance)} {holding.coin}
                    </div>
                  </td>

                  {/* Long-term gain */}
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle text-right">
                    <div
                      className={`font-semibold ${holding.ltcg.gain < 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-500"}`}
                      title={holding.ltcg.gain.toString()}
                    >
                      {formatGain(holding.ltcg.gain)}
                    </div>
                    <div
                      className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5"
                      title={holding.ltcg.balance.toString()}
                    >
                      {formatAmount(holding.ltcg.balance)} {holding.coin}
                    </div>
                  </td>

                  {/* Amount to sell - shows value only when row is selected */}
                  <td
                    className={`px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle text-right pr-6 ${isSelected ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-300 dark:text-slate-600 font-normal"}`}
                  >
                    {isSelected
                      ? `${formatAmount(holding.totalHolding)} ${holding.coin}`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile table ── */}
      <div className="md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom w-[52px] pl-4">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(checked) => onToggleAll(checked)}
                />
              </th>
              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-left">
                Asset
              </th>
              <th className="text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3 bg-slate-50 dark:bg-[#141824] border-b border-slate-200 dark:border-slate-700 whitespace-nowrap align-bottom text-right pr-4">
                Holdings
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((holding) => {
              const isSelected = selectedIds.has(holding.id);
              const totalValue = holding.currentPrice * holding.totalHolding;

              return (
                <tr
                  key={holding.id}
                  onClick={() => onToggle(holding.id)}
                  className={`cursor-pointer ${isSelected ? "bg-blue-50 dark:bg-[#162033]" : "bg-transparent"}`}
                >
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle pl-4 w-[52px]">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggle(holding.id)}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={holding.logo}
                        alt={holding.coin}
                        className="w-8 h-8 rounded-full object-cover bg-slate-100 dark:bg-[#1e2535] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                        }}
                      />
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {holding.coinName.length > 18
                            ? holding.coinName.slice(0, 18) + "…"
                            : holding.coinName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {holding.coin}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-slate-100 dark:border-[#1e2535] align-middle text-right pr-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {formatAmount(holding.totalHolding)} {holding.coin}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatValue(totalValue)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View all / View less button - only shows if more than 4 holdings */}
      {holdings.length > 4 && (
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[13px] font-medium text-blue-600 bg-transparent border-none cursor-pointer p-0"
          >
            {showAll ? "View less" : "View all"}
          </button>
        </div>
      )}
    </div>
  );
}

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
};

function Checkbox({ checked, indeterminate, onChange }: CheckboxProps) {
  const isActive = checked || indeterminate;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Don't trigger row click
        onChange(!checked);
      }}
      className={`
        w-4 h-4 rounded border-[1.5px] flex items-center justify-center cursor-pointer shrink-0
        ${
          isActive
            ? "border-blue-600 bg-blue-600"
            : "border-slate-300 dark:border-slate-600 bg-transparent"
        }
      `}
    >
      {/* Checkmark icon */}
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path
            d="M1 3.5L3.2 5.5L8 1"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {/* Minus icon for indeterminate state */}
      {!checked && indeterminate && (
        <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
          <path
            d="M0.5 1H7.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
