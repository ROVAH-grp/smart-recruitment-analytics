import type { ReactNode } from "react";
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from "react-sparklines";

interface KPICardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: { value: string; up: boolean; neutral?: boolean };
  subtitle?: string;
  sparkData?: number[];
  sparkColor?: string;
}

export default function KPICard({ label, value, icon, iconBg, iconColor, trend, subtitle, sparkData, sparkColor = "var(--accent)" }: KPICardProps) {
  return (
    <div
      className="card-hover"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-sm)",
        padding: "16px 18px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: "default",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: iconBg, color: iconColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{icon}</div>

        {trend && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 2,
            fontSize: 11, fontWeight: 700,
            color: trend.neutral ? "var(--text-secondary)" : trend.up ? "var(--green)" : "var(--red)",
            background: trend.neutral ? "var(--border-light)" : trend.up ? "var(--green-light)" : "var(--red-light)",
            padding: "2px 7px", borderRadius: 99, letterSpacing: "0",
          }}>
            {!trend.neutral && (trend.up ? "↑" : "↓")} {trend.value}
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.8px", lineHeight: 1, marginBottom: 4 }}>{value}</div>

      {/* Label */}
      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, letterSpacing: "-0.1px", marginBottom: subtitle ? 2 : 0 }}>{label}</div>
      {subtitle && <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", fontStyle: "italic" }}>{subtitle}</div>}

      {/* Sparkline */}
      {sparkData && (
        <div className="kpi-spark" style={{ marginTop: 10, opacity: 0.7 }}>
          <Sparklines data={sparkData} width={150} height={28} margin={2}>
            <SparklinesLine color={sparkColor} style={{ fill: "none", strokeWidth: 1.8 }} />
          </Sparklines>
        </div>
      )}
    </div>
  );
}
