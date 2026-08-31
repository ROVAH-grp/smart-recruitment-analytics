type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  status: string;
  size?: BadgeSize;
  dot?: boolean;
}

/* Each status maps to one of eight themed hue families defined in index.css
   as --badge-{family}-bg / -color / -border, so dark mode and simple mode
   both apply automatically without touching this file. */
const FAMILY: Record<string, string> = {
  applied: "indigo",
  screened: "green",
  shortlisted: "amber",
  interviewed: "blue",
  selected: "green",
  offered: "violet",
  joined: "cyan",
  rejected: "red",
  withdrawn: "gray",
  active: "green",
  open: "indigo",
  closed: "red",
  paused: "amber",
  scheduled: "blue",
  completed: "green",
  pending: "amber",
  accepted: "green",
  declined: "red",
  in_progress: "blue",
  fulltime: "indigo",
  remote: "green",
  default: "gray",
};

const LABELS: Record<string, string> = {
  applied: "Applied", screened: "Screened", shortlisted: "Shortlisted", interviewed: "Interviewed",
  selected: "Selected", offered: "Offered", joined: "Joined", rejected: "Rejected", withdrawn: "Withdrawn",
  active: "Active", open: "Open", closed: "Closed", paused: "Paused", scheduled: "Scheduled",
  completed: "Completed", pending: "Pending", accepted: "Accepted", declined: "Declined",
  in_progress: "In Progress", fulltime: "Full-time", remote: "Remote",
};

const sizes = {
  xs: { padding: "1px 6px", fontSize: 10.5, dotSize: 5 },
  sm: { padding: "2px 8px", fontSize: 11.5, dotSize: 6 },
  md: { padding: "4px 10px", fontSize: 12.5, dotSize: 7 },
};

export default function Badge({ status, size = "sm", dot = false }: BadgeProps) {
  const key = status.toLowerCase().replace(/[\s-]/g, "_");
  const family = FAMILY[key] ?? FAMILY.default;
  const label = LABELS[key] ?? status;
  const s = sizes[size];

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: s.padding,
      borderRadius: 99,
      background: `var(--badge-${family}-bg)`,
      border: `1px solid var(--badge-${family}-border)`,
      color: `var(--badge-${family}-color)`,
      fontSize: s.fontSize,
      fontWeight: 600,
      letterSpacing: "0.05px",
      whiteSpace: "nowrap",
    }}>
      {dot && (
        <span style={{ width: s.dotSize, height: s.dotSize, borderRadius: "50%", background: `var(--badge-${family}-color)`, opacity: 0.8, flexShrink: 0 }} />
      )}
      {label}
    </span>
  );
}
