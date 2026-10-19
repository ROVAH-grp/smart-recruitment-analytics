import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

import {
  getJoiningRecords,
  createJoiningRecord,
  updateJoiningRecord,
} from "../api/joiningRecords";

import type { JoiningRecord } from "../api/joiningRecords";

const JOINING_FIELDS = [
  {
    key: "applicationId",
    label: "Application ID",
    placeholder: "e.g. 3049",
    required: true,
  },
  {
    key: "joiningDate",
    label: "Joining Date",
    type: "date" as const,
    required: false,
  },
  {
    key: "joiningStatus",
    label: "Joining Status",
    type: "select" as const,
    options: [
      "Joined",
      "No Show",
      "Delayed",
      "Cancelled",
    ],
    required: false,
  },
];

function formatDate(date: string | null): string {
  if (!date) return "—";
  return date;
}

export default function JoiningRecords() {
  const [list, setList] = useState<JoiningRecord[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    msg: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadJoiningRecords = async () => {
    try {
      setLoading(true);

      const response = await getJoiningRecords(
        1,
        100,
      );

      setList(response.data);
    } catch (error) {
      console.error(error);

      showToast(
        "Could not load joining records.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJoiningRecords();
  }, []);

  const handleCreate = async (
    data: Record<string, string>,
  ) => {
    try {
      await createJoiningRecord({
        applicationId: data.applicationId,
        joiningDate:
          data.joiningDate || undefined,
        joiningStatus:
          data.joiningStatus || "Joined",
      });

      setShowAdd(false);

      await loadJoiningRecords();

      showToast(
        `Joining record created for application #${data.applicationId}.`,
      );
    } catch (error) {
      console.error(error);

      let message =
        "Failed to create joining record.";

      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(
            error.message,
          );

          if (Array.isArray(parsed?.message)) {
            message =
              parsed.message.join(", ");
          } else if (
            typeof parsed?.message === "string"
          ) {
            message = parsed.message;
          }
        } catch {
          if (error.message) {
            message = error.message;
          }
        }
      }

      showToast(message, "error");
    }
  };

  const handleCancel = async (
    record: JoiningRecord,
  ) => {
    try {
      const updated =
        await updateJoiningRecord(
          record.joiningId,
          {
            joiningStatus: "Cancelled",
          },
        );

      setList((previous) =>
        previous.map((item) =>
          item.joiningId ===
          updated.joiningId
            ? updated
            : item,
        ),
      );

      showToast(
        `Joining record #${record.joiningId} cancelled.`,
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to cancel joining record.",
        "error",
      );
    }
  };

  const joinedCount = list.filter(
    (record) =>
      record.joiningStatus === "Joined",
  ).length;

  return (
    <>
      <GenericTable
        title="Joining Records"
        subtitle={
          loading
            ? "Loading joining records..."
            : `${joinedCount} employees joined · ${list.length} loaded`
        }
        data={
          list as unknown as Record<
            string,
            unknown
          >[]
        }
        addLabel="Add Joining Record"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "joining-records.csv",
            list as unknown as Record<
              string,
              unknown
            >[],
          )
        }
        searchKeys={[
          "joiningId",
          "applicationId",
          "joiningStatus",
        ]}
        columns={[
          {
            key: "joiningId",
            label: "ID",
            render: (r) => (
              <span
                style={{
                  fontFamily:
                    "var(--font-mono)",
                  fontSize: 11.5,
                  color:
                    "var(--text-tertiary)",
                }}
              >
                {String(r.joiningId)}
              </span>
            ),
          },
          {
            key: "applicationId",
            label: "Application",
            render: (r) => (
              <span
                style={{
                  fontWeight: 600,
                }}
              >
                #{String(r.applicationId)}
              </span>
            ),
          },
          {
            key: "joiningDate",
            label: "Joining Date",
            render: (r) => (
              <span
                style={{
                  fontSize: 12.5,
                  color:
                    "var(--text-secondary)",
                  fontFamily:
                    "var(--font-mono)",
                }}
              >
                {formatDate(
                  r.joiningDate as
                    | string
                    | null,
                )}
              </span>
            ),
          },
          {
            key: "joiningStatus",
            label: "Status",
            render: (r) => (
              <Badge
                status={String(
                  r.joiningStatus ||
                    "Pending",
                )}
                dot
              />
            ),
          },
          {
            key: "createdAt",
            label: "Created",
            render: (r) => (
              <span
                style={{
                  fontSize: 12,
                  color:
                    "var(--text-secondary)",
                  fontFamily:
                    "var(--font-mono)",
                }}
              >
                {new Date(
                  String(r.createdAt),
                ).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            sortable: false,
            render: (r) => {
              const record =
                r as unknown as JoiningRecord;

              if (
                record.joiningStatus !==
                "Joined"
              ) {
                return null;
              }

              return (
                <button
                  onClick={() =>
                    handleCancel(record)
                  }
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border:
                      "1px solid var(--red-border)",
                    background:
                      "var(--red-light)",
                    fontSize: 11.5,
                    color:
                      "var(--red)",
                    cursor: "pointer",
                    fontFamily:
                      "inherit",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              );
            },
          },
        ]}
      />

      {showAdd && (
        <FormModal
          title="Add Joining Record"
          subtitle="Record a candidate's joining status"
          fields={JOINING_FIELDS}
          onClose={() =>
            setShowAdd(false)
          }
          onSubmit={handleCreate}
          submitLabel="Add Record"
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
              <path d="M9 1v16" />
              <path d="M1 9h16" />
            </svg>
          }
        />
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() =>
            setToast(null)
          }
        />
      )}
    </>
  );
}