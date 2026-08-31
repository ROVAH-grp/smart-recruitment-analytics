import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";
import KPICard from "../components/KPICard";

/* ── data ── */
const monthlyData = [
  { month: "Jan", applicants: 54, hired: 6 },
  { month: "Feb", applicants: 62, hired: 7 },
  { month: "Mar", applicants: 89, hired: 9 },
  { month: "Apr", applicants: 75, hired: 8 },
  { month: "May", applicants: 110, hired: 12 },
  { month: "Jun", applicants: 95, hired: 10 },
  { month: "Jul", applicants: 130, hired: 14 },
  { month: "Aug", applicants: 118, hired: 13 },
  { month: "Sep", applicants: 142, hired: 16 },
  { month: "Oct", applicants: 105, hired: 11 },
  { month: "Nov", applicants: 90, hired: 9 },
  { month: "Dec", applicants: 74, hired: 8 },
];

const deptData = [
  { dept: "Engineering", applicants: 280, joined: 28 },
  { dept: "Sales", applicants: 190, joined: 22 },
  { dept: "Marketing", applicants: 145, joined: 16 },
  { dept: "Design", applicants: 112, joined: 13 },
  { dept: "Ops", applicants: 98, joined: 11 },
  { dept: "Finance", applicants: 74, joined: 8 },
  { dept: "HR", applicants: 60, joined: 4 },
];

const sourceData = [
  { name: "LinkedIn", value: 340 },
  { name: "Indeed", value: 220 },
  { name: "Referral", value: 185 },
  { name: "Website", value: 130 },
  { name: "Naukri", value: 90 },
  { name: "Other", value: 35 },
];

const COLORS = ["var(--accent)", "var(--cyan-mid)", "var(--green-mid)", "var(--amber-mid)", "var(--purple-mid)", "var(--text-tertiary)"];

const funnelStages = [
  { name: "Applied",     value: 1000, color: "var(--accent)" },
  { name: "Screened",    value: 620,  color: "var(--accent-dark)" },
  { name: "Shortlisted", value: 390,  color: "var(--cyan-mid)" },
  { name: "Interviewed", value: 240,  color: "var(--green-mid)" },
  { name: "Selected",    value: 160,  color: "var(--amber-mid)" },
  { name: "Offered",     value: 130,  color: "var(--purple-mid)" },
  { name: "Joined",      value: 102,  color: "var(--rose)" },
];

const kpis = [
  {
    label: "Total Applicants", value: "1,000",
    iconBg: "var(--accent-light)", iconColor: "var(--accent)",
    trend: { value: "+12%", up: true },
    sparkData: [54,62,89,75,110,95,130,118,142,105,90,74],
    sparkColor: "var(--accent)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M16 17v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  },
  {
    label: "Total Joined", value: "102",
    iconBg: "var(--cyan-light)", iconColor: "var(--cyan)",
    trend: { value: "+8%", up: true },
    sparkData: [6,7,9,8,12,10,14,13,16,11,9,8],
    sparkColor: "var(--cyan-mid)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M16 9.7V10a8 8 0 1 1-4.73-7.33"/><polyline points="18,3 10,11 7,8"/></svg>,
  },
  {
    label: "Avg. Time to Hire", value: "18 days",
    iconBg: "var(--amber-light)", iconColor: "var(--amber)",
    trend: { value: "−2d", up: false },
    sparkData: [22,20,21,19,18,20,17,18,16,18,19,18],
    sparkColor: "var(--amber-mid)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="9" cy="9" r="8"/><polyline points="9,4 9,9 12,11"/></svg>,
  },
  {
    label: "Avg. Time to Fill", value: "24 days",
    iconBg: "var(--purple-light)", iconColor: "var(--purple)",
    trend: { value: "+3d", up: false },
    sparkData: [20,22,24,21,25,23,26,24,24,25,23,24],
    sparkColor: "var(--purple-mid)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="1" y="3" width="16" height="14" rx="2"/><line x1="13" y1="1" x2="13" y2="5"/><line x1="5" y1="1" x2="5" y2="5"/><line x1="1" y1="8" x2="17" y2="8"/></svg>,
  },
  {
    label: "Avg. Interview Score", value: "74.68",
    iconBg: "var(--green-light)", iconColor: "var(--green)",
    trend: { value: "+1.2", up: true },
    sparkData: [71,72,73,74,74,75,74,75,74,74,75,74],
    sparkColor: "var(--green-mid)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polygon points="9,1 11.5,6.5 17.5,7.4 13,11.7 14.3,17.5 9,14.5 3.7,17.5 5,11.7 0.5,7.4 6.5,6.5"/></svg>,
  },
  {
    label: "Offer Acceptance", value: "64%",
    iconBg: "var(--rose-light)", iconColor: "var(--rose)",
    trend: { value: "−3%", up: false },
    sparkData: [68,66,65,67,64,66,65,63,64,65,64,64],
    sparkColor: "var(--rose)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="18,9 14,9 11,17 7,1 4,9 0,9"/></svg>,
  },
  {
    label: "Hiring Success Rate", value: "10.2%",
    iconBg: "var(--accent-2-light)", iconColor: "var(--accent-2)",
    trend: { value: "+0.8%", up: true },
    subtitle: "Joined ÷ Applicants",
    sparkData: [9.1,9.3,9.5,9.8,10.0,10.0,10.1,10.0,10.2,10.1,10.2,10.2],
    sparkColor: "var(--accent)",
    icon: <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="15" y1="17" x2="15" y2="8"/><line x1="9" y1="17" x2="9" y2="3"/><line x1="3" y1="17" x2="3" y2="11"/></svg>,
  },
];

const TT = {
  background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: 8,
  boxShadow: "var(--chart-tooltip-shadow)", fontSize: 12.5, fontFamily: "Inter, sans-serif", padding: "8px 12px", color: "var(--text)",
};

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.25px" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "3px 0 0", letterSpacing: "-0.1px" }}>{subtitle}</p>}
      </div>
      {action && <button style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{action}</button>}
    </div>
  );
}

function ChartCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-sm)", padding: "20px 22px", ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Recent Activity ── */
const recentActivity = [
  { who: "Aryan Mehta", action: "moved to Shortlisted", job: "Sr. Frontend Engineer", time: "2m ago", avatar: "A", color: "var(--accent)" },
  { who: "Priya Sharma", action: "offer accepted", job: "HR Business Partner", time: "18m ago", avatar: "P", color: "var(--green-mid)" },
  { who: "Vikram Singh", action: "interview completed", job: "Backend Engineer", time: "1h ago", avatar: "V", color: "var(--amber-mid)" },
  { who: "Sneha Kapoor", action: "application screened", job: "Data Scientist", time: "2h ago", avatar: "S", color: "var(--purple-mid)" },
];

export default function Dashboard() {
  const [activePie, setActivePie] = useState<number | null>(null);

  return (
    <div className="fade-in" style={{ padding: "24px 24px 48px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 5px", letterSpacing: "-0.6px" }}>
              Good morning, Recruiter 👋
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0, letterSpacing: "-0.1px" }}>
              Here's what's happening with your recruitment pipeline today.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><rect x="1" y="2" width="12" height="11" rx="1.5"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="4" y1="1" x2="4" y2="4"/><line x1="1" y1="6" x2="13" y2="6"/></svg>
              Last 30 days
            </button>
            <button style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px var(--accent-shadow)" }}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="1,4 5,1 9,4"/><line x1="5" y1="1" x2="5" y2="10"/><line x1="1" y1="13" x2="13" y2="13"/></svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 12, marginBottom: 20 }}>
        {kpis.map(k => <KPICard key={k.label} {...k} />)}
      </div>

      {/* Row 1: Funnel + Trend */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 14, marginBottom: 14 }}>
        {/* Funnel */}
        <ChartCard>
          <SectionHeader title="Recruitment Funnel" subtitle="Pipeline drop-off by stage" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {funnelStages.map((s, i) => {
              const pct = Math.round((s.value / funnelStages[0].value) * 100);
              const drop = i > 0 ? Math.round(((funnelStages[i - 1].value - s.value) / funnelStages[i - 1].value) * 100) : null;
              return (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.1px" }}>{s.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {drop !== null && (
                        <span style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>−{drop}%</span>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontVariantNumeric: "tabular-nums", minWidth: 34, textAlign: "right" }}>{s.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "var(--border-light)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversion rate */}
          <div style={{ marginTop: 16, padding: "10px 12px", background: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Overall conversion</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>10.2%</span>
          </div>
        </ChartCard>

        {/* Monthly Trend */}
        <ChartCard>
          <SectionHeader title="Monthly Hiring Trend" subtitle="Applicants vs hires — trailing 12 months" action="Details →" />
          <ResponsiveContainer width="100%" height={228}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gradApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradHired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green-mid)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--green-mid)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="applicants" stroke="var(--accent)" strokeWidth={2} fill="url(#gradApp)" name="Applicants" dot={false} />
              <Area type="monotone" dataKey="hired" stroke="var(--green-mid)" strokeWidth={2} fill="url(#gradHired)" name="Hired" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Dept bar + Source donut + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px 260px", gap: 14 }}>
        {/* Dept */}
        <ChartCard>
          <SectionHeader title="Applicants by Department" subtitle="Applicants vs joined per team" action="Full report →" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={12} barGap={3}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="dept" tick={{ fontSize: 10.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="applicants" fill="var(--accent)" name="Applicants" radius={[3, 3, 0, 0]} />
              <Bar dataKey="joined" fill="var(--green-mid)" name="Joined" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Source donut */}
        <ChartCard>
          <SectionHeader title="Applicants by Source" subtitle="Channel distribution" />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <PieChart width={160} height={160}>
              <Pie
                data={sourceData}
                cx={75} cy={75}
                innerRadius={48} outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                onMouseEnter={(_, i) => setActivePie(i)}
                onMouseLeave={() => setActivePie(null)}
              >
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} opacity={activePie === null || activePie === i ? 1 : 0.45} />
                ))}
              </Pie>
              <Tooltip contentStyle={TT} />
            </PieChart>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {sourceData.map((s, i) => {
              const pct = Math.round((s.value / 1000) * 100);
              return (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: "var(--text)", flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Recent activity */}
        <ChartCard>
          <SectionHeader title="Recent Activity" subtitle="Latest pipeline updates" />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `color-mix(in srgb, ${a.color} 16%, transparent)`, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{a.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: "var(--text)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.who}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{a.action}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.job}</div>
                </div>
                <span style={{ fontSize: 10.5, color: "var(--text-tertiary)", flexShrink: 0, marginTop: 1 }}>{a.time}</span>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 12, width: "100%", padding: "7px", border: "1px solid var(--border)", borderRadius: 7, background: "transparent", fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit" }}>
            View all activity
          </button>
        </ChartCard>
      </div>
    </div>
  );
}
