import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius, flexShrink: 0, ...style }} />
  );
}

export function KPICardSkeleton() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={38} height={38} borderRadius={9} />
        <Skeleton width={52} height={20} borderRadius={99} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width="60%" height={28} />
        <Skeleton width="80%" height={13} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "13px 16px" }}>
          <Skeleton width={i === 0 ? 60 : i === 1 ? 120 : 80} height={13} />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height, background: "var(--border-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "flex-end", gap: 8, padding: 16, overflow: "hidden" }}>
      {[60, 80, 45, 90, 70, 55, 85, 65].map((h, i) => (
        <div key={i} className="skeleton" style={{ flex: 1, height: `${h}%`, borderRadius: 4 }} />
      ))}
    </div>
  );
}
