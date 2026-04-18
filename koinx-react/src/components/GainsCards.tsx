function formatMoney(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$ ${abs}`;
}

function formatNegative(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `- $ ${abs}`;
}

function formatNet(amount: number): string {
  return amount < 0 ? formatNegative(amount) : formatMoney(amount);
}

type GainsCardProps = {
  stProfits: number;
  stLosses: number;
  ltProfits: number;
  ltLosses: number;
};

export function PreHarvestingCard({
  stProfits,
  stLosses,
  ltProfits,
  ltLosses,
}: GainsCardProps) {
  const stNet = stProfits - stLosses;
  const ltNet = ltProfits - ltLosses;
  const totalRealised = stNet + ltNet;

  return (
    <div className="bg-white dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">
        Pre Harvesting
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-normal text-slate-400 pb-3 w-2/5"></th>
            <th className="text-right text-xs font-normal text-slate-400 pb-3 pr-4">
              Short-term
            </th>
            <th className="text-right text-xs font-normal text-slate-400 pb-3">
              Long-term
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Profits row */}
          <tr>
            <td className="text-sm text-slate-500 dark:text-slate-400 pb-3">
              Profits
            </td>
            <td className="text-sm text-slate-900 dark:text-slate-100 text-right pb-3 pr-4">
              {formatMoney(stProfits)}
            </td>
            <td className="text-sm text-slate-900 dark:text-slate-100 text-right pb-3">
              {formatMoney(ltProfits)}
            </td>
          </tr>
          {/* Losses row */}
          <tr>
            <td className="text-sm text-slate-500 dark:text-slate-400 pb-3">
              Losses
            </td>
            <td className="text-sm text-slate-900 dark:text-slate-100 text-right pb-3 pr-4">
              {formatNegative(stLosses)}
            </td>
            <td className="text-sm text-slate-900 dark:text-slate-100 text-right pb-3">
              {formatNegative(ltLosses)}
            </td>
          </tr>
          {/* Net Capital Gains row */}
          <tr>
            <td className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Net Capital Gains
            </td>
            <td className="text-sm text-slate-900 dark:text-slate-100 font-bold text-right pr-4">
              {formatNet(stNet)}
            </td>
            <td className="text-sm text-slate-900 dark:text-slate-100 font-bold text-right">
              {formatNet(ltNet)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Realised Capital Gains total */}
      <div className="border-t border-slate-200 dark:border-slate-700 mt-5 pt-4">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Realised Capital Gains:{" "}
        </span>
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {formatNet(totalRealised)}
        </span>
      </div>
    </div>
  );
}

type AfterHarvestingCardProps = GainsCardProps & {
  preRealisedGains: number;
};

export function AfterHarvestingCard({
  stProfits,
  stLosses,
  ltProfits,
  ltLosses,
  preRealisedGains,
}: AfterHarvestingCardProps) {
  const stNet = stProfits - stLosses;
  const ltNet = ltProfits - ltLosses;
  const effectiveGains = stNet + ltNet;
  const savings = preRealisedGains - effectiveGains;
  const hasSavings = savings > 0;

  return (
    // Always blue regardless of theme
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <h2 className="text-base font-bold text-white mb-5">After Harvesting</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-normal text-blue-200 pb-3 w-2/5"></th>
            <th className="text-right text-xs font-normal text-blue-200 pb-3 pr-4">
              Short-term
            </th>
            <th className="text-right text-xs font-normal text-blue-200 pb-3">
              Long-term
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Profits row */}
          <tr>
            <td className="text-sm text-blue-100 pb-3">Profits</td>
            <td className="text-sm text-white text-right pb-3 pr-4">
              {formatMoney(stProfits)}
            </td>
            <td className="text-sm text-white text-right pb-3">
              {formatMoney(ltProfits)}
            </td>
          </tr>
          {/* Losses row */}
          <tr>
            <td className="text-sm text-blue-100 pb-3">Losses</td>
            <td className="text-sm text-white text-right pb-3 pr-4">
              {formatNegative(stLosses)}
            </td>
            <td className="text-sm text-white text-right pb-3">
              {formatNegative(ltLosses)}
            </td>
          </tr>
          {/* Net Capital Gains row */}
          <tr>
            <td className="text-sm text-blue-100 font-medium">
              Net Capital Gains
            </td>
            <td className="text-sm text-white font-bold text-right pr-4">
              {formatNet(stNet)}
            </td>
            <td className="text-sm text-white font-bold text-right">
              {formatNet(ltNet)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Effective Capital Gains total */}
      <div className="border-t border-white/20 mt-5 pt-4">
        <span className="text-sm font-semibold text-white">
          Effective Capital Gains:{" "}
        </span>
        <span className="text-2xl font-bold text-white">
          {formatNet(effectiveGains)}
        </span>

        {/* Savings message — matches design exactly from video */}
        {hasSavings && (
          <div className="mt-2 text-[13px] text-white">
            <span className="mr-1 inline-block drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]">
              ▶
            </span>
            Your taxable capital gains are reduced by:{" "}
            <strong>
              ${" "}
              {savings.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
