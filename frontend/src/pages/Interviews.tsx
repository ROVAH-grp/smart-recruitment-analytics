import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

import {
  getInterviews,
  createInterview,
} from "../api/interviews";

import type { Interview } from "../api/interviews";

const INTERVIEW_FIELDS = [
  {
    key: "applicationId",
    label: "Application ID",
    placeholder: "e.g. 1",
    required: true,
  },
  {
    key: "interviewDate",
    label: "Interview Date",
    type: "date" as const,
    required: true,
  },
  {
    key: "technicalScore",
    label: "Technical Score",
    type: "number" as const,
    placeholder: "0 - 100",
  },
  {
    key: "communicationScore",
    label: "Communication Score",
    type: "number" as const,
    placeholder: "0 - 100",
  },
  {
    key: "problemSolvingScore",
    label: "Problem Solving Score",
    type: "number" as const,
    placeholder: "0 - 100",
  },
];

function toNumber(value: string | number | null): number | null {
  if (value === null || value === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return date;
}

export default function Interviews() {
  const [list, setList] = useState<Interview[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const loadInterviews = async () => {
    try {
      setLoading(true);

      const response = await getInterviews(1, 100);

      setList(response.data);
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Could not load interviews.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleSchedule = async (
    data: Record<string, string>,
  ) => {
    try {
      const created = await createInterview({
        applicationId: data.applicationId,
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

      setList((previous) => [created, ...previous]);
      setShowAdd(false);

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

 

  const scheduledCount = list.filter(
    (interview) => interview.interviewDate !== null,
  ).length;

  return (
    <>
      <GenericTable
        title="Interviews"
        subtitle={
          loading
            ? "Loading interviews..."
            : `${scheduledCount} scheduled · ${list.length} loaded`
        }
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Schedule Interview"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "interviews.csv",
            list as unknown as Record<string, unknown>[],
          )
        }
        searchKeys={[
          "interviewId",
          "applicationId",
        ]}
        columns={[
          {
            key: "interviewId",
            label: "ID",
            render: (r) => (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                }}
              >
                {String(r.interviewId)}
              </span>
            ),
          },
          {
            key: "applicationId",
            label: "Application",
            render: (r) => (
              <span style={{ fontWeight: 600 }}>
                #{String(r.applicationId)}
              </span>
            ),
          },
          {
            key: "interviewDate",
            label: "Interview Date",
            render: (r) => (
              <span
                style={{
                  fontSize: 12.5,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {formatDate(
                  r.interviewDate as string | null,
                )}
              </span>
            ),
          },
          {
            key: "technicalScore",
            label: "Technical",
            render: (r) => {
              const score = toNumber(
                r.technicalScore as string | number | null,
              );

              return (
                <span style={{ fontWeight: 600 }}>
                  {score !== null ? score.toFixed(0) : "—"}
                </span>
              );
            },
          },
          {
            key: "communicationScore",
            label: "Communication",
            render: (r) => {
              const score = toNumber(
                r.communicationScore as string | number | null,
              );

              return (
                <span style={{ fontWeight: 600 }}>
                  {score !== null ? score.toFixed(0) : "—"}
                </span>
              );
            },
          },
          {
            key: "problemSolvingScore",
            label: "Problem Solving",
            render: (r) => {
              const score = toNumber(
                r.problemSolvingScore as string | number | null,
              );

              return (
                <span style={{ fontWeight: 600 }}>
                  {score !== null ? score.toFixed(0) : "—"}
                </span>
              );
            },
          },
          {
            key: "overallScore",
            label: "Score",
            render: (r) => {
              const score = toNumber(
                r.overallScore as string | number | null,
              );

              return score !== null ? (
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {score.toFixed(1)}
                  <span
                    style={{
                      color: "var(--text-tertiary)",
                      fontWeight: 400,
                    }}
                  >
                    /100
                  </span>
                </span>
              ) : (
                <span
                  style={{
                    color: "var(--text-tertiary)",
                  }}
                >
                  —
                </span>
              );
            },
          },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge
                status={
                  r.interviewDate
                    ? "scheduled"
                    : "pending"
                }
                dot
              />
            ),
          },
        ]}
        
      />

      {showAdd && (
        <FormModal
          title="Schedule Interview"
          subtitle="Set up a new candidate interview"
          fields={INTERVIEW_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handleSchedule}
          submitLabel="Schedule"
          icon={
            <svg
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <rect
                x="1"
                y="2"
                width="16"
                height="15"
                rx="2"
              />
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="1" y1="7" x2="17" y2="7" />
            </svg>
          }
        />
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}