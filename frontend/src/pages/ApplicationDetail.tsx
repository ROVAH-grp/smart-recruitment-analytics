import Badge from "../components/Badge";
import FormModal, { Toast } from "../components/FormModal";
import { createInterview } from "../api/interviews";
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from "react-sparklines";
import { useEffect, useState } from "react";
import {
  getInterviews,
  type Interview,
} from "../api/interviews";



const STAGES = ["Applied", "Screened", "Shortlisted", "Interviewed", "Selected", "Offered", "Joined"];
const STAGE_ORDER: Record<string, number> = {
  applied: 0, screened: 1, shortlisted: 2, interviewed: 3, selected: 4, offered: 5, joined: 6,
};
const STAGE_DATES = ["Jan 8", "Jan 15", "Jan 22", "Feb 5", "Feb 15", "Feb 18", "Mar 1"];

interface App {
  id: string; candidate: string; candidateId: string; job: string; jobId: string;
  recruiter: string; source: string; status: string; matchScore: number;
  appliedDate: string; joiningDate: string | null; dept: string;
  interviewScore: number | null; offerStatus: string | null; cost: number;
}

function InfoTile({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "13px 16px", boxShadow: "var(--shadow-xs)" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: mono ? "var(--font-mono)" : "inherit", letterSpacing: mono ? "-0.2px" : "-0.1px" }}>{value}</div>
    </div>
  );
}

export default function ApplicationDetail({ app, onBack }: { app: App; onBack: () => void }) {
    const [interview, setInterview] =
    useState<Interview | null>(null);

  const [interviewLoading, setInterviewLoading] =
    useState(true);

    const [showScheduleInterview, setShowScheduleInterview] =
  useState(false);

const [toast, setToast] = useState<{
  msg: string;
  type: "success" | "error";
} | null>(null);


  useEffect(() => {

  
    const loadInterview = async () => {
      try {
        setInterviewLoading(true);

        const response = await getInterviews(
          1,
          1,
          app.id,
        );

        setInterview(
          response.data[0] ?? null,
        );
      } catch (error) {
        console.error(
          "Failed to load interview:",
          error,
        );
        setInterview(null);
      } finally {
        setInterviewLoading(false);
      }
    };

    loadInterview();
  }, [app.id]);

  // This must be OUTSIDE useEffect
const handleScheduleInterview = async (
  data: Record<string, string>,
) => {
  try {
    const created = await createInterview({
      applicationId: app.id,
      interviewDate: data.interviewDate || undefined,
      technicalScore: data.technicalScore
        ? Number(data.technicalScore)
        : undefined,
      communicationScore: data.communicationScore
        ? Number(data.communicationScore)
        : undefined,
      problemSolvingScore: data.problemSolvingScore
        ? Number(data.problemSolvingScore)
        : undefined,
    });

    setInterview(created);
    setShowScheduleInterview(false);

    setToast({
      msg: "Interview scheduled successfully.",
      type: "success",
    });

    setTimeout(() => setToast(null), 3500);
  } catch (error) {
    console.error(error);

    let message = "Failed to schedule interview.";

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);

        if (Array.isArray(parsed?.message)) {
          message = parsed.message.join(", ");
        } else if (typeof parsed?.message === "string") {
          message = parsed.message;
        }
      } catch {
        if (error.message) {
          message = error.message;
        }
      }
    }

    setToast({
      msg: message,
      type: "error",
    });
  }
};

    const overallScore =
    interview?.overallScore != null
      ? Number(interview.overallScore)
      : null;

  const technicalScore =
    interview?.technicalScore != null
      ? Number(interview.technicalScore)
      : null;

  const communicationScore =
    interview?.communicationScore != null
      ? Number(interview.communicationScore)
      : null;

  const problemSolvingScore =
    interview?.problemSolvingScore != null
      ? Number(interview.problemSolvingScore)
      : null;

  const stageIdx = STAGE_ORDER[app.status] ?? -1;
  const hue = (app.candidate.charCodeAt(0) * 47 + app.candidate.charCodeAt(1) * 13) % 360;
  const scoreHistory = [
  68,
  74,
  79,
  overallScore ?? 74,
];
  const costBreakdown = [
    { label: "Job Posting", val: Math.round(app.cost * 0.18) },
    { label: "Assessment", val: Math.round(app.cost * 0.22) },
    { label: "Interview", val: Math.round(app.cost * 0.25) },
    { label: "Background Check", val: Math.round(app.cost * 0.15) },
    { label: "Onboarding", val: Math.round(app.cost * 0.20) },
  ];

  return (
    <div className="fade-in" style={{ padding: "24px 24px 48px" }}>
      {/* Back */}
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 13, fontFamily: "inherit", marginBottom: 20, padding: 0, fontWeight: 500 }}>
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="9,12 5,7 9,2"/></svg>
        Back to Applications
      </button>

      {/* Header card */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px 24px", marginBottom: 16, boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `hsl(${hue}, 55%, 92%)`,
          color: `hsl(${hue}, 55%, 38%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 800, flexShrink: 0,
        }}>{app.candidate[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>{app.candidate}</h1>
            <Badge status={app.status} size="md" dot />
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0", letterSpacing: "-0.1px" }}>{app.job} · {app.dept}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
          <button style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(79,110,247,0.3)" }}>Send Offer</button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px 28px", marginBottom: 16, boxShadow: "var(--shadow-sm)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.2px" }}>Recruitment Journey</div>
        <div style={{ position: "relative", paddingBottom: 4 }}>
          {/* Track line */}
          <div style={{ position: "absolute", top: 14, left: "7%", right: "7%", height: 2, background: "var(--border-light)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 14, left: "7%", width: stageIdx >= 0 ? `${(stageIdx / (STAGES.length - 1)) * 86}%` : "0%", height: 2, background: "var(--accent)", zIndex: 0, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {STAGES.map((stage, i) => {
              const done = stageIdx >= i;
              const active = stageIdx === i;
              return (
                <div key={stage} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? "var(--accent)" : "var(--surface)",
                    border: `2px solid ${done ? "var(--accent)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: active ? "0 0 0 5px var(--accent-glow)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    {done && (
                      <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ marginTop: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 11.5, fontWeight: done ? 700 : 400, color: done ? "var(--accent)" : "var(--text-tertiary)", letterSpacing: "-0.1px" }}>{stage}</div>
                    {STAGE_DATES[i] && done && (
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>{STAGE_DATES[i]}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        <InfoTile label="Application ID" value={app.id} mono />
        <InfoTile label="Candidate ID" value={app.candidateId} mono />
        <InfoTile label="Job ID" value={app.jobId} mono />
        <InfoTile label="Department" value={app.dept} />
        <InfoTile label="Recruiter" value={app.recruiter} />
        <InfoTile label="Source" value={app.source} />
        <InfoTile label="Applied Date" value={app.appliedDate} />
        <InfoTile label="Offer Status" value={app.offerStatus ? app.offerStatus.charAt(0).toUpperCase() + app.offerStatus.slice(1) : "—"} />
      </div>

      {/* Bottom: match score + interview + cost */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {/* Match score ring */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Match Score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="var(--border-light)" strokeWidth="8"/>
                <circle
                  cx="40" cy="40" r="30" fill="none"
                  stroke={app.matchScore >= 85 ? "#059669" : app.matchScore >= 70 ? "#D97706" : "#DC2626"}
                  strokeWidth="8"
                  strokeDasharray={`${app.matchScore * 1.885} 188.5`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dasharray 0.8s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-1px" }}>{app.matchScore}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.8px" }}>{app.matchScore}%</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                {app.matchScore >= 85 ? "Excellent fit" : app.matchScore >= 70 ? "Good fit" : "Below threshold"}
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[["Skills", app.matchScore + 2], ["Experience", app.matchScore - 4], ["Culture", app.matchScore + 1]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-secondary)", width: 64 }}>{k}</span>
                    <div style={{ flex: 1, height: 4, background: "var(--border-light)", borderRadius: 99 }}>
                      <div style={{ height: "100%", width: `${Number(v)}%`, background: "var(--accent)", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", width: 28, textAlign: "right" }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interview score */}
<div
  style={{
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "20px 22px",
    boxShadow: "var(--shadow-sm)",
  }}
>
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      color: "var(--text)",
      marginBottom: 16,
    }}
  >
    Interview Performance
  </div>

  {interviewLoading ? (
    <div
      style={{
        color: "var(--text-tertiary)",
        fontSize: 13,
        paddingTop: 8,
      }}
    >
      Loading interview data...
    </div>
  ) : overallScore != null ? (
    <>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "-1px",
          marginBottom: 2,
        }}
      >
        {overallScore}
        <span
          style={{
            fontSize: 16,
            color: "var(--text-tertiary)",
            fontWeight: 500,
          }}
        >
          /100
        </span>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          marginBottom: 14,
        }}
      >
        {overallScore >= 85
          ? "Outstanding"
          : overallScore >= 75
            ? "Strong"
            : "Satisfactory"}
      </div>

      <div style={{ marginBottom: 14 }}>
        <Sparklines data={scoreHistory} width={180} height={40}>
          <SparklinesLine
            color="#4F6EF7"
            style={{
              fill: "none",
              strokeWidth: 2,
            }}
          />
          <SparklinesReferenceLine
            type="avg"
            style={{
              stroke: "#E5E7EB",
              strokeDasharray: "3 2",
              strokeWidth: 1,
            }}
          />
        </Sparklines>

        <div
          style={{
            fontSize: 10.5,
            color: "var(--text-tertiary)",
            marginTop: 4,
          }}
        >
          Interview score progression
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {[
          ["Technical", technicalScore],
          ["Communication", communicationScore],
          ["Problem Solving", problemSolvingScore],
        ].map(([label, score]) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 11.5,
                color: "var(--text-secondary)",
                flex: 1,
              }}
            >
              {label}
            </span>

            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text)",
                width: 26,
                textAlign: "right",
              }}
            >
              {score != null ? score : "—"}
            </span>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div
      style={{
        color: "var(--text-tertiary)",
        fontSize: 13,
        paddingTop: 8,
      }}
    >
      No interview data yet
    </div>
  )}
</div>

        {/* Recruitment cost */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Recruitment Cost</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-1px", marginBottom: 2 }}>₹{app.cost.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Total spend on this hire</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {costBreakdown.map(row => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>₹{row.val.toLocaleString()}</span>
                </div>
                <div style={{ height: 3, background: "var(--border-light)", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${(row.val / app.cost) * 100}%`, background: "var(--accent)", borderRadius: 99, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
