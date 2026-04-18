import { useState } from "react";

const notes = [
  "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
  "Tax harvesting does not apply to derivatives or futures.",
  "Price data is fetched from Coingecko and may slightly differ from your exchange.",
  "Some countries calculate everything as long-term gains.",
  "Only realized losses are considered for harvesting.",
];

export function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-blue-200 dark:border-blue-900 rounded-xl bg-blue-50 dark:bg-[#0f1f38] overflow-hidden">
      {/* Header row — click to expand */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer text-left"
      >
        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
          ℹ️ Important Notes &amp; Disclaimers
        </span>
        <span className="text-blue-500 text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Notes — only visible when open */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-blue-200 dark:border-blue-900">
          <ul className="pl-5 mt-3 space-y-2">
            {notes.map((note, index) => (
              <li
                key={index}
                className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
