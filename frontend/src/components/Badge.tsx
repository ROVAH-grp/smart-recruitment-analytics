type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  status: string;
  size?: BadgeSize;
  dot?: boolean;
}

const variants: Record<string, { bg: string; color: string; border: string; label: string }> = {
  applied:         { bg: "#EEF1FE", color: "#4338CA", border: "#C7D2FE", label: "Applied" },
  screened:        { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", label: "Screened" },
  shortlisted:     { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Shortlisted" },
  interviewed:     { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Interviewed" },
  selected:        { bg: "#F0FDF4", color: "#065F46", border: "#A7F3D0", label: "Selected" },
  offered:         { bg: "#F5F3FF", color: "#5B21B6", border: "#DDD6FE", label: "Offered" },
  joined:          { bg: "#ECFEFF", color: "#155E75", border: "#A5F3FC", label: "Joined" },
  rejected:        { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA", label: "Rejected" },
  withdrawn:       { bg: "#F9FAFB", color: "#4B5563", border: "#D1D5DB", label: "Withdrawn" },
  active:          { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", label: "Active" },
  open:            { bg: "#EEF1FE", color: "#4338CA", border: "#C7D2FE", label: "Open" },
  closed:          { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA", label: "Closed" },
  paused:          { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Paused" },
  scheduled:       { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Scheduled" },
  completed:       { bg: "#F0FDF4", color: "#065F46", border: "#A7F3D0", label: "Completed" },
  pending:         { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Pending" },
  accepted:        { bg: "#F0FDF4", color: "#065F46", border: "#A7F3D0", label: "Accepted" },
  declined:        { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA", label: "Declined" },
  in_progress:     { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "In Progress" },
  fulltime:        { bg: "#EEF1FE", color: "#4338CA", border: "#C7D2FE", label: "Full-time" },
  remote:          { bg: "#F0FDF4", color: "#065F46", border: "#A7F3D0", label: "Remote" },
  default:         { bg: "#F3F4F6", color: "#4B5563", border: "#E5E7EB", label: "" },
};

const sizes = {
  xs: { padding: "1px 6px", fontSize: 10.5, dotSize: 5 },
  sm: { padding: "2px 8px", fontSize: 11.5, dotSize: 6 },
  md: { padding: "4px 10px", fontSize: 12.5, dotSize: 7 },
};

export default function Badge({ status, size = "sm", dot = false }: BadgeProps) {
  const key = status.toLowerCase().replace(/[\s-]/g, "_");
  const v = variants[key] ?? { ...variants.default, label: status };
  const s = sizes[size];

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: s.padding,
      borderRadius: 99,
      background: v.bg,
      border: `1px solid ${v.border}`,
      color: v.color,
      fontSize: s.fontSize,
      fontWeight: 600,
      letterSpacing: "0.05px",
      whiteSpace: "nowrap",
    }}>
      {dot && (
        <span style={{ width: s.dotSize, height: s.dotSize, borderRadius: "50%", background: v.color, opacity: 0.8, flexShrink: 0 }} />
      )}
      {v.label || status}
    </span>
  );
}
