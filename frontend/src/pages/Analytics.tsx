import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";

const deptData = [
  { dept: "Engineering", applicants: 280, joined: 28, costPerHire: 16500 },
  { dept: "Sales", applicants: 190, joined: 22, costPerHire: 7200 },
  { dept: "Marketing", applicants: 145, joined: 16, costPerHire: 9800 },
  { dept: "Design", applicants: 112, joined: 13, costPerHire: 11200 },
  { dept: "Operations", applicants: 98, joined: 11, costPerHire: 8400 },
  { dept: "Finance", applicants: 74, joined: 8, costPerHire: 12600 },
];

const sourceData = [
  { name: "LinkedIn", applicants: 340, hired: 38, cph: 1184 },
  { name: "Indeed", applicants: 220, hired: 22, cph: 818 },
  { name: "Referral", applicants: 185, hired: 28, cph: 429 },
  { name: "Website", applicants: 130, hired: 10, cph: 400 },
  { name: "Naukri", applicants: 90, hired: 6, cph: 1500 },
];

const recruiterData = [
  { name: "Sarah M.", assigned: 4, filled: 2, rate: 50 },
  { name: "James W.", assigned: 3, filled: 2, rate: 67 },
  { name: "Emily C.", assigned: 3, filled: 1, rate: 33 },
];

const monthlyData = [
  { month: "Feb", applicants: 62, hired: 7, cost: 68000 },
  { month: "Mar", applicants: 89, hired: 9, cost: 92000 },
  { month: "Apr", applicants: 75, hired: 8, cost: 78000 },
  { month: "May", applicants: 110, hired: 12, cost: 118000 },
  { month: "Jun", applicants: 95, hired: 10, cost: 99000 },
  { month: "Jul", applicants: 130, hired: 14, cost: 142000 },
  { month: "Aug", applicants: 118, hired: 13, cost: 125000 },
];

const scoreDistData = [
  { range: "0–40", count: 35 },
  { range: "41–60", count: 120 },
  { range: "61–75", count: 380 },
  { range: "76–90", count: 390 },
  { range: "91–100", count: 75 },
];

const expData = [
  { exp: "0–1 yr", count: 95 },
  { exp: "1–3 yrs", count: 240 },
  { exp: "3–5 yrs", count: 310 },
  { exp: "5–8 yrs", count: 220 },
  { exp: "8+ yrs", count: 135 },
];

const COLORS = ["var(--accent)", "var(--cyan-mid)", "var(--green-mid)", "var(--amber-mid)", "var(--purple-mid)", "var(--rose)"];

const TooltipStyle = {
  background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: 8,
  boxShadow: "var(--chart-tooltip-shadow)", fontSize: 12.5, fontFamily: "Inter, sans-serif", padding: "8px 12px", color: "var(--text)",
};

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5, letterSpacing: "0.3px", textTransform: "uppercase" }}>{label}</label>
      <select style={{ border: "1px solid var(--border)", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--text)", background: "var(--surface)", cursor: "pointer", outline: "none", fontFamily: "inherit", width: "100%" }}>
        <option>All</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ChartCard({ title, subtitle, children, span = 1 }: { title: string; subtitle?: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", padding: 22,
      gridColumn: span > 1 ? `span ${span}` : undefined,
    }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.2px" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Analytics() {
  return (
    <div style={{ padding: "28px 28px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.4px" }}>Analytics</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Deep-dive into your recruitment performance metrics.</p>
      </div>

      {/* Filters */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", padding: "18px 20px", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)", margin: 0 }}>Filters</h2>
          <button style={{ fontSize: 12, color: "var(--accent)", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Reset All</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
          <FilterSelect label="Department" options={["Engineering", "Sales", "Marketing", "Design", "Operations", "Finance"]} />
          <FilterSelect label="Source" options={["LinkedIn", "Indeed", "Referral", "Company Website", "Naukri"]} />
          <FilterSelect label="Recruiter" options={["Sarah Mitchell", "James Watson", "Emily Clarke"]} />
          <FilterSelect label="Job Position" options={["Sr. Frontend Engineer", "HR Business Partner", "Data Scientist", "UI/UX Designer"]} />
          <FilterSelect label="Education" options={["B.Tech", "MBA", "B.Sc", "M.Sc", "B.Com", "CA"]} />
          <FilterSelect label="Status" options={["Applied", "Screened", "Shortlisted", "Interviewed", "Selected", "Offered", "Joined"]} />
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5, letterSpacing: "0.3px", textTransform: "uppercase" }}>Date From</label>
            <input type="date" defaultValue="2024-01-01" style={{ border: "1px solid var(--border)", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--text)", background: "var(--surface)", outline: "none", fontFamily: "inherit", width: "100%" }} />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 5, letterSpacing: "0.3px", textTransform: "uppercase" }}>Date To</label>
            <input type="date" defaultValue="2024-12-31" style={{ border: "1px solid var(--border)", borderRadius: 7, padding: "7px 10px", fontSize: 13, color: "var(--text)", background: "var(--surface)", outline: "none", fontFamily: "inherit", width: "100%" }} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* By Department */}
        <ChartCard title="Applicants by Department" subtitle="Applicants vs joined">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="dept" tick={{ fontSize: 10.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Bar dataKey="applicants" fill="var(--accent)" name="Applicants" radius={[3,3,0,0]} />
              <Bar dataKey="joined" fill="var(--green-mid)" name="Joined" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* By Source */}
        <ChartCard title="Applicants by Source" subtitle="Hired vs applicants per channel">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData} layout="vertical" margin={{ top: 4, right: 30, left: 10, bottom: 0 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
              <XAxis type="number" tick={{ fontSize: 10.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={TooltipStyle} />
              <Bar dataKey="applicants" fill="var(--accent)" name="Applicants" radius={[0,3,3,0]} />
              <Bar dataKey="hired" fill="var(--green-mid)" name="Hired" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recruiter Performance */}
        <ChartCard title="Recruiter Performance" subtitle="Assigned vs filled positions">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={recruiterData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="name" tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Bar dataKey="assigned" fill="var(--accent)" name="Assigned" radius={[4,4,0,0]} />
              <Bar dataKey="filled" fill="var(--green-mid)" name="Filled" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Experience Distribution */}
        <ChartCard title="Experience Distribution" subtitle="Applicants by years of experience">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={expData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="exp" tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Bar dataKey="count" fill="var(--purple-mid)" name="Candidates" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Match Score Distribution */}
        <ChartCard title="Match Score Distribution" subtitle="Candidates per score band">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={scoreDistData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="range" tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Bar dataKey="count" name="Candidates" radius={[4,4,0,0]}>
                {scoreDistData.map((_, i) => <Cell key={i} fill={["var(--red-mid)","var(--amber-mid)","var(--amber-mid)","var(--green-mid)","var(--green-mid)"][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Trend */}
        <ChartCard title="Monthly Hiring Trend" subtitle="Applicants and hires over time">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="applicants" stroke="var(--accent)" strokeWidth={2.5} dot={false} name="Applicants" />
              <Line type="monotone" dataKey="hired" stroke="var(--green-mid)" strokeWidth={2.5} dot={false} name="Hired" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Per Hire by Dept */}
        <ChartCard title="Cost Per Hire by Department" subtitle="Average recruitment cost (₹)" span={2}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="dept" tick={{ fontSize: 11.5, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--chart-tick)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TooltipStyle} formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Cost Per Hire"]} />
              <Bar dataKey="costPerHire" name="Cost Per Hire" radius={[4,4,0,0]}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
