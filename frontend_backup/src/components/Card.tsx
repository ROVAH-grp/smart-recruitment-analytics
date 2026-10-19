import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-sm)",
      ...style,
    }}>
      {children}
    </div>
  );
}
