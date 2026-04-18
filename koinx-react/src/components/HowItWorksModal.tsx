import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface Props {
  onClose: () => void;
}

export function HowItWorksModal({ onClose }: Props) {
  const { isDark } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const MODAL_BG = isDark ? "#161b27" : "#ffffff";
  const OVERLAY_BG = "rgba(0,0,0,0.6)";
  const BORDER = isDark ? "#1f2937" : "#e5e7eb";
  const TITLE = isDark ? "#f1f5f9" : "#111827";
  const BODY = isDark ? "#94a3b8" : "#374151";
  const STEP_BG = isDark ? "#0f1320" : "#f8faff";
  const STEP_BORDER = isDark ? "#1e3358" : "#bfdbfe";
  const STEP_TITLE = isDark ? "#e2e8f0" : "#1e3a8a";
  const NUM_BG = "#2563eb";
  const CLOSE_BG = isDark ? "#1f2937" : "#f3f4f6";
  const CLOSE_CLR = isDark ? "#94a3b8" : "#6b7280";

  const steps = [
    {
      num: "1",
      title: "Review your capital gains",
      desc: 'Look at the "Pre Harvesting" card to understand your current short-term and long-term gains and losses from your portfolio.',
    },
    {
      num: "2",
      title: "Select holdings to harvest",
      desc: "Check the boxes next to assets in the Holdings table that have unrealised losses. Selling these assets can offset your gains.",
    },
    {
      num: "3",
      title: "See your savings in real-time",
      desc: 'The "After Harvesting" card updates instantly to show how your net capital gains drop, reducing your tax liability.',
    },
    {
      num: "4",
      title: "Execute your strategy",
      desc: 'Review the "Amount to Sell" column for selected assets, then execute the trades on your exchange to lock in the tax savings.',
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: OVERLAY_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.15s ease",
      }}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: MODAL_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          animation: "slideUp 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 24px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Leaf/sprout icon */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 9-9 2 4 1 9-2 12" />
                <path d="M11 20c0-4.5 2.5-8.5 5-11" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: TITLE,
                margin: 0,
              }}
            >
              How Tax Loss Harvesting Works
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: CLOSE_BG,
              color: CLOSE_CLR,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Intro */}
        <p
          style={{
            fontSize: "14px",
            color: BODY,
            lineHeight: "1.7",
            margin: "14px 24px 20px",
          }}
        >
          Tax Loss Harvesting is a strategy where you sell assets at a loss to
          offset capital gains from profitable assets, reducing your overall tax
          liability for the year.
        </p>

        {/* Steps */}
        <div
          style={{
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                gap: "14px",
                backgroundColor: STEP_BG,
                border: `1px solid ${STEP_BORDER}`,
                borderRadius: "10px",
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: NUM_BG,
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: STEP_TITLE,
                    marginBottom: "4px",
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{ fontSize: "13px", color: BODY, lineHeight: "1.6" }}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer note */}
        <div
          style={{
            margin: "20px 24px 24px",
            padding: "12px 16px",
            backgroundColor: isDark ? "#1a120a" : "#fffbeb",
            border: `1px solid ${isDark ? "#78350f" : "#fde68a"}`,
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0, marginTop: "1px" }}
          >
            <path
              d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 5v3.5M8 10.5v.5"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p
            style={{
              fontSize: "12px",
              color: isDark ? "#fcd34d" : "#92400e",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            <strong>Note:</strong> Tax-loss harvesting is currently not allowed
            under Indian tax regulations. Please consult your tax advisor before
            making any investment decisions.
          </p>
        </div>

        {/* Close button */}
        <div style={{ padding: "0 24px 24px" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "11px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#1d4ed8")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
          >
            Got it
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
