import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";
import {
  getRecruiters,
  createRecruiter,
  type Recruiter,
} from "../api/recruiters";

const RECRUITER_FIELDS = [
  {
    key: "recruiterName",
    label: "Full Name",
    placeholder: "e.g. James Watson",
    required: true,
  },
];

export default function Recruiters() {
  const [list, setList] = useState<Recruiter[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const loadRecruiters = async () => {
    try {
      setLoading(true);

      const response = await getRecruiters(1, 100);

      setList(response.data);
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Failed to load recruiters.",
        type: "error",
      });

      setTimeout(() => setToast(null), 3500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  const handleAdd = async (data: Record<string, string>) => {
    try {
      await createRecruiter({
        recruiterName: data.recruiterName,
      });

      setShowAdd(false);

      await loadRecruiters();

      setToast({
        msg: `Recruiter "${data.recruiterName}" added!`,
        type: "success",
      });

      setTimeout(() => setToast(null), 3500);
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Failed to add recruiter.",
        type: "error",
      });

      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <>
      <GenericTable
        title="Recruiters"
        subtitle={
          loading
            ? "Loading recruiters..."
            : `${list.length} active recruiters`
        }
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Add Recruiter"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "recruiters.csv",
            list as unknown as Record<string, unknown>[],
          )
        }
        searchKeys={["recruiterName"]}
        columns={[
          {
            key: "recruiterId",
            label: "ID",
            render: (r) => (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                }}
              >
                R{String(r.recruiterId).padStart(3, "0")}
              </span>
            ),
          },

          {
            key: "recruiterName",
            label: "Recruiter",
            render: (r) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background:
                      "linear-gradient(135deg,var(--accent-dark), var(--accent))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {String(r.recruiterName)[0]?.toUpperCase()}
                </div>

                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {String(r.recruiterName)}
                </div>
              </div>
            ),
          },

          {
            key: "createdAt",
            label: "Created",
            render: (r) => (
              <span
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {r.createdAt
                  ? new Date(String(r.createdAt)).toLocaleDateString()
                  : "—"}
              </span>
            ),
          },
        ]}
      />

      {showAdd && (
        <FormModal
          title="Add Recruiter"
          subtitle="Onboard a new team recruiter"
          fields={RECRUITER_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          submitLabel="Add Recruiter"
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
              <path d="M14 15v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2" />
              <circle cx="8" cy="5" r="4" />
              <line x1="15" y1="7" x2="15" y2="13" />
              <line x1="12" y1="10" x2="18" y2="10" />
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