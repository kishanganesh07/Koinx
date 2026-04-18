import { useTheme } from "../context/ThemeContext";

export function Header() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="h-[60px] sticky top-0 z-50 bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-[#21262d]">
      <div className="max-w-[1140px] mx-auto px-6 h-full flex items-center justify-between">
        {/* KoinX Logo aligned left above Tax Harvesting */}
        <div className="flex items-center">
          <span className="text-[22px] font-extrabold text-blue-600">Koin</span>
          <span className="text-[22px] font-extrabold text-amber-500">X</span>
          <sup className="text-[8px] text-slate-400 ml-0.5">®</sup>
        </div>

        {/* Spacer to push theme toggle to the right */}
        <div className="flex-1" />

        {/* Theme toggle button */}
        <button
          onClick={toggle}
          title="Toggle theme"
          className="w-9 h-9 rounded-lg border border-slate-200 dark:border-[#21262d] bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-slate-200 cursor-pointer flex items-center justify-center text-base hover:opacity-80 relative z-10"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
