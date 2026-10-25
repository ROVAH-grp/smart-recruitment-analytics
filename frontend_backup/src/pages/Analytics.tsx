import { useState } from "react";
import { exportToCsv } from "../utils/exportCsv";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";

const TT = {
  background: "#fff", border: "1px solid #E2E6F0", borderRadius: 8,
  boxShadow: "0 4px 16px rgba(17,24,39,0.08)", fontSize: 12.5, fontFamily: "Inter, sans-serif", padding: "8px 12px",
};

const deptData = [
  { dept: "Engineering", applicants: 280, joined: 28, costPerHire: 16500 },
  { dept: "Sales",       applicants: 190, joined: 22, costPerHire: 7200 },
  { dept: "Marketing",   applicants: 145, joined: 16, costPerHire: 9800 },
  { dept: "Design",      applicants: 112, joined: 13, costPerHire: 11200 },
  { dept: "Operations",  applicants: 98,  joined: 11, costPerHire: 8400 },
  { dept: "Finance",     applicants: 74,  joined: 8,  costPerHire: 12600 },
];

const sourceData = [
  { name: "LinkedIn",  applicants: 340, hired: 38, cph: 1184 },
  { name: "Indeed",    applicants: 220, hired: 22, cph: 818 },
  { name: "Referral",  applicants: 185, hired: 28, cph: 429 },
  { name: "Website",   applicants: 130, hired: 10, cph: 400 },
  { name: "Naukri",    applicants: 90,  hired: 6,  cph: 1500 },
];

const recruiterData = [
  { name: "Sarah M.", assigned: 4, filled: 2, rate: 50 },
  { name: "James W.", assigned: 3, filled: 2, rate: 67 },
  { name: "Emily C.", assigned: 3, filled: 1, rate: 33 },
];

const monthlyData = [
  { month: "Jan", applicants: 54, hired: 6,  cost: 58000 },
  { month: "Feb", applicants: 62, hired: 7,  cost: 68000 },
  { month: "Mar", applicants: 89, hired: 9,  cost: 92000 },
  { month: "Apr", applicants: 75, hired: 8,  cost: 78000 },
  { month: "May", applicants: 110,hired: 12, cost: 118000 },
  { month: "Jun", applicants: 95, hired: 10, cost: 99000 },
  { month: "Jul", applicants: 130,hired: 14, cost: 142000 },
  { month: "Aug", applicants: 118,hired: 13, cost: 125000 },
];

const expData = [
  { exp: "0–1 yr",  count: 95 },
  { exp: "1–3 yrs", count: 240 },
  { exp: "3–5 yrs", count: 310 },
  { exp: "5–8 yrs", count: 220 },
  { exp: "8+ yrs",  count: 135 },
];

const scoreData = [
  { range: "0–40",   count: 35,  fill: "#EF4444" },
  { range: "41–60",  count: 120, fill: "#F59E0B" },
  { range: "61–75",  count: 380, fill: "#4F6EF7" },
  { range: "76–90",  count: 390, fill: "#10B981" },
  { range: "91–100", count: 75,  fill: "#059669" },
];

const COLORS = ["#4F6EF7", "#06B6D4", "#10B981", "#F59E0B", "#8B5CF6", "#94A3B8"];

const KPI_SUMMARY = [
  { label: "Total Pipeline", value: "1,000", delta: "+12%", up: true },
  { label: "Conversion Rate", value: "10.2%", delta: "+0.8%", up: true },
  { label: "Avg. Cost/Hire", value: "₹11.3k", delta: "−₹900", up: true },
  { label: "Avg. Time to Hire", value: "18 days", delta: "−2d", up: true },
];

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", display: "block", marginBottom: 5, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</label>
      <select style={{ border: "1px solid var(--border)", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--text)", background: "var(--surface)", cursor: "pointer", fontFamily: "inherit", width: "100%", outline: "none", transition: "border-color 0.15s" }}>
        <option>All</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ChartCard({ title, subtitle, children, colSpan = 1 }: { title: string; subtitle?: string; children: React.ReactNode; colSpan?: number }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-sm)", padding: "20px 22px", gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
    }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.25px" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

export default function Analytics() {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div className="fade-in" style={{ padding: "24px 24px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 3px", letterSpacing: "-0.5px" }}>Analytics</h1>
          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0 }}>Deep-dive into recruitment performance and trends.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setFiltersOpen(v => !v)}
            style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="12" height="12"><line x1="1" y1="3" x2="13" y2="3"/><line x1="3" y1="7" x2="11" y2="7"/><line x1="5" y1="11" x2="9" y2="11"/></svg>
            {filtersOpen ? "Hide" : "Show"} Filters
          </button>
          <button
            onClick={() => exportToCsv("analytics-report.csv", deptData as unknown as Record<string, unknown>[])}
            style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M7 1v8M4 6l3 3 3-3"/><path d="M1 10v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {KPI_SUMMARY.map(k => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.7px" }}>{k.value}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: k.up ? "var(--green-light)" : "var(--red-light)", color: k.up ? "var(--green)" : "var(--red)" }}>
              {k.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "18px 20px 20px", marginBottom: 18, boxShadow: "var(--shadow-xs)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.1px" }}>Filters</div>
            <button style={{ fontSize: 12, color: "var(--accent)", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Reset all</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
            <FilterSelect label="Department" options={["Engineering", "Sales", "Marketing", "Design", "Operations", "Finance", "HR"]} />
            <FilterSelect label="Source" options={["LinkedIn", "Indeed", "Referral", "Company Website", "Naukri"]} />
            <FilterSelect label="Recruiter" options={["Sarah Mitchell", "James Watson", "Emily Clarke"]} />
            <FilterSelect label="Job Position" options={["Sr. Frontend Engineer", "HR Business Partner", "Data Scientist", "UI/UX Designer", "Sales Executive"]} />
            <FilterSelect label="Education" options={["B.Tech", "MBA", "B.Sc", "M.Sc", "B.Com", "CA", "B.Des"]} />
            <FilterSelect label="Status" options={["Applied", "Screened", "Shortlisted", "Interviewed", "Selected", "Offered", "Joined", "Rejected"]} />
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", display: "block", marginBottom: 5, letterSpacing: "0.5px", textTransform: "uppercase" }}>Date From</label>
              <input type="date" defaultValue="2024-01-01" style={{ border: "1px solid var(--border)", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--text)", background: "var(--surface)", outline: "none", fontFamily: "inherit", width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", display: "block", marginBottom: 5, letterSpacing: "0.5px", textTransform: "uppercase" }}>Date To</label>
              <input type="date" defaultValue="2024-12-31" style={{ border: "1px solid var(--border)", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--text)", background: "var(--surface)", outline: "none", fontFamily: "inherit", width: "100%" }} />
            </div>
          </div>
        </div>
      )}

      {/* Charts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Department */}
        <ChartCard title="Applicants by Department" subtitle="Applicants vs joined per team">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={12} barGap={3}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="dept" tick={{ fontSize: 10.5, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="applicants" fill="#4F6EF7" name="Applicants" radius={[3,3,0,0]} />
              <Bar dataKey="joined" fill="#10B981" name="Joined" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Source (horizontal) */}
        <ChartCard title="Applicants by Source" subtitle="Hired vs total per channel">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barSize={10} barGap={3}>
              <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={62} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="applicants" fill="#4F6EF7" name="Applicants" radius={[0,3,3,0]} />
              <Bar dataKey="hired" fill="#10B981" name="Hired" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recruiter */}
        <ChartCard title="Recruiter Performance" subtitle="Positions assigned vs filled">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={recruiterData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="assigned" fill="#4F6EF7" name="Assigned" radius={[4,4,0,0]} />
              <Bar dataKey="filled" fill="#10B981" name="Filled" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Experience */}
        <ChartCard title="Experience Distribution" subtitle="Candidates by years of experience">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={expData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={26}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="exp" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="count" name="Candidates" radius={[4,4,0,0]}>
                {expData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Match Score */}
        <ChartCard title="Match Score Distribution" subtitle="Candidates per score band">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={scoreData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="range" tick={{ fontSize: 11.5, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="count" name="Candidates" radius={[4,4,0,0]}>
                {scoreData.map((s, i) => <Cell key={i} fill={s.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly trend */}
        <ChartCard title="Monthly Hiring Trend" subtitle="Applicants and hires — trailing 8 months">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gApp2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F6EF7" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#4F6EF7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gHired2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="applicants" stroke="#4F6EF7" strokeWidth={2} fill="url(#gApp2)" name="Applicants" dot={false} />
              <Area type="monotone" dataKey="hired" stroke="#10B981" strokeWidth={2} fill="url(#gHired2)" name="Hired" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost per hire — full width */}
        <ChartCard title="Cost Per Hire by Department" subtitle="Average total recruitment spend (₹)" colSpan={2}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barSize={42}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="dept" tick={{ fontSize: 11.5, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TT} formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Cost Per Hire"]} />
              <Bar dataKey="costPerHire" name="Cost Per Hire" radius={[5,5,0,0]}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
