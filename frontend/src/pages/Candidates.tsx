import { useEffect, useState } from "react";
import {
  getCandidates,
  createCandidate,
  deleteCandidate,
  type Candidate,
} from "../api/candidates";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast, ConfirmDialog } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

const CANDIDATE_FIELDS = [
  {
    key: "candidateId",
    label: "Candidate ID",
    placeholder: "e.g. C1001",
  },
  {
    key: "name",
    label: "Full Name",
    placeholder: "e.g. Priya Desai",
  },
  {
    key: "education",
    label: "Education",
    type: "select" as const,
    options: [
      "B.Tech",
      "MBA",
      "B.Sc",
      "M.Sc",
      "B.Com",
      "CA",
      "B.Des",
      "M.Tech",
    ],
  },
  {
    key: "experience",
    label: "Experience (years)",
    placeholder: "e.g. 3.5",
  },
];

interface CandidatesProps {
  onCandidateClick: (candidateId: string) => void;
}

export default function Candidates({
  onCandidateClick,
}: CandidatesProps) {
  const [list, setList] = useState<Candidate[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const showToast = (
    msg: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);

      const response = await getCandidates(page, 20, search);

      setList(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      showToast("Failed to load candidates.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [page, search]);

  const handleAdd = async (data: Record<string, string>) => {
    try {
      await createCandidate({
        candidateId: data.candidateId,
        candidateName: data.name,
        experienceYears: data.experience
          ? Number(data.experience)
          : undefined,
        education: data.education || undefined,
      });

      setShowAdd(false);

      showToast(`Candidate "${data.name}" added successfully!`);

      await loadCandidates();
    } catch (error) {
      console.error("Failed to add candidate:", error);
      showToast("Failed to add candidate.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCandidate(id);

      setDeleteId(null);

      showToast("Candidate removed successfully.");

      await loadCandidates();
    } catch (error) {
      console.error("Failed to delete candidate:", error);
      showToast("Failed to remove candidate.", "error");
    }
  };

 const tableData = list.map((candidate) => ({
  id: candidate.candidateId,
  candidateId: candidate.candidateId,
  name: candidate.candidateName,
  experience: candidate.experienceYears
    ? `${candidate.experienceYears} yrs`
    : "—",
  education: candidate.education || "—",
  createdAt: candidate.createdAt,

  email: "—",
  location: "—",
  skills: [] as string[],
  status: "applied",
}));

  return (
    <>
      <GenericTable
        title="Candidates"
        subtitle={
          loading
            ? "Loading candidates..."
            : `${total} total candidates`
        }
        data={tableData as Record<string, unknown>[]}
        addLabel="Add Candidate"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "candidates.csv",
            tableData as Record<string, unknown>[],
          )
        }
        searchKeys={["name", "id", "education"]}
        columns={[
          {
            key: "id",
            label: "ID",
            render: (r) => (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-tertiary)",
                  fontSize: 11.5,
                }}
              >
                {String(r.id)}
              </span>
            ),
          },

         {
  key: "name",
  label: "Candidate",
  render: (r) => {
    const name = String(r.name);

    const hue =
      (name.charCodeAt(0) * 47 +
        (name.charCodeAt(1) || 0) * 13) %
      360;

    return (
      <button
        type="button"
        onClick={() => onCandidateClick(String(r.candidateId))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            flexShrink: 0,
            background: `hsl(${hue},55%,92%)`,
            color: `hsl(${hue},55%,35%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {name[0]}
        </div>

        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {name}
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: "var(--text-tertiary)",
            }}
          >
            View profile
          </div>
        </div>
      </button>
    );
  },
},

          {
            key: "location",
            label: "Location",
            render: () => (
              <span style={{ color: "var(--text-secondary)" }}>
                —
              </span>
            ),
          },

          {
            key: "experience",
            label: "Experience",
            render: (r) => (
              <span style={{ color: "var(--text-secondary)" }}>
                {String(r.experience)}
              </span>
            ),
          },

          {
            key: "education",
            label: "Education",
            render: (r) => (
              <span style={{ color: "var(--text-secondary)" }}>
                {String(r.education)}
              </span>
            ),
          },

          {
            key: "skills",
            label: "Skills",
            render: () => (
              <span
                style={{
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                }}
              >
                —
              </span>
            ),
          },

          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge
                status={String(r.status)}
                dot
              />
            ),
          },

          {
            key: "actions",
            label: "",
            sortable: false,
            render: (r) => (
              <button
                onClick={() => setDeleteId(String(r.id))}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Remove
              </button>
            ),
          },
        ]}
      />

      {showAdd && (
        <FormModal
          title="Add Candidate"
          subtitle="Fill in the candidate's profile information"
          fields={CANDIDATE_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          submitLabel="Add Candidate"
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
              <path d="M16 17v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Remove Candidate"
          message="Are you sure you want to remove this candidate? This action cannot be undone."
          confirmLabel="Remove"
          danger
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
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