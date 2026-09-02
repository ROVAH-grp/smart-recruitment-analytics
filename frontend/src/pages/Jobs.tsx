import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast, ConfirmDialog } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";
import {
  createJob,
  deleteJob,
  getJobs,
  type Job,
} from "../api/jobs";

const JOB_FIELDS = [
  {
    key: "jobId",
    label: "Job ID",
    placeholder: "e.g. J001",
  },
  {
    key: "jobTitle",
    label: "Job Title",
    placeholder: "e.g. Senior Backend Engineer",
  },
  {
    key: "department",
    label: "Department",
    type: "select" as const,
    options: [
      "Engineering",
      "Sales",
      "Marketing",
      "Design",
      "Operations",
      "Finance",
      "HR",
      "AI & ML",
    ],
  },
  {
    key: "jobPostedDate",
    label: "Posted Date",
    type: "date" as const,
  },
];

export default function Jobs() {
  const [list, setList] = useState<Job[]>([]);
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

  const loadJobs = async () => {
    try {
      setLoading(true);

      const response = await getJobs(page, 20, search);

      setList(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error(error);
      showToast("Failed to load jobs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, search]);

  const handlePost = async (data: Record<string, string>) => {
    try {
      await createJob({
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        department: data.department || undefined,
        jobPostedDate: data.jobPostedDate || undefined,
      });

      setShowAdd(false);
      setPage(1);

      if (page === 1) {
        await loadJobs();
      }

      showToast(`Job "${data.jobTitle}" posted successfully!`);
    } catch (error) {
      console.error(error);
      showToast("Failed to create job.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id);

      setDeleteId(null);

      if (list.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadJobs();
      }

      showToast("Job deleted successfully.");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete job.", "error");
    }
  };

  const tableData = list.map((job) => ({
    id: job.jobId,
    title: job.jobTitle,
    dept: job.department ?? "—",
    location: "—",
    type: "—",
    openings: "—",
    applicants: "—",
    status: "open",
    postedDate: job.jobPostedDate ?? "—",
    actions: job.jobId,
  }));

  return (
    <>
      <GenericTable
        title="Jobs"
        subtitle={`${total} total`}
        data={tableData as Record<string, unknown>[]}
        addLabel="Post Job"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "jobs.csv",
            tableData as Record<string, unknown>[],
          )
        }
        searchKeys={["id", "title", "dept"]}
          
        columns={[
          {
            key: "id",
            label: "ID",
            render: (r) => (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                }}
              >
                {String(r.id)}
              </span>
            ),
          },
          {
            key: "title",
            label: "Job Title",
            render: (r) => (
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {String(r.title)}
              </span>
            ),
          },
          {
            key: "dept",
            label: "Department",
            render: (r) => (
              <span
                style={{
                  fontSize: 12.5,
                  color: "var(--text-secondary)",
                }}
              >
                {String(r.dept)}
              </span>
            ),
          },
          {
            key: "location",
            label: "Location",
            render: (r) => (
              <span
                style={{
                  fontSize: 12.5,
                  color: "var(--text-tertiary)",
                }}
              >
                {String(r.location)}
              </span>
            ),
          },
          {
            key: "type",
            label: "Type",
            render: (r) => (
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: "var(--accent-light)",
                  color: "var(--accent-text)",
                  fontWeight: 500,
                }}
              >
                {String(r.type)}
              </span>
            ),
          },
          {
            key: "openings",
            label: "Openings",
            render: (r) => (
              <span style={{ fontWeight: 700 }}>
                {String(r.openings)}
              </span>
            ),
          },
          {
            key: "applicants",
            label: "Applicants",
            render: () => (
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 13,
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
              <Badge status={String(r.status)} dot />
            ),
          },
          {
            key: "postedDate",
            label: "Posted",
            render: (r) => (
              <span
                style={{
                  color: "var(--text-tertiary)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {String(r.postedDate)}
              </span>
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
                Delete
              </button>
            ),
          },
        ]}
      />

      {loading && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "var(--text-tertiary)",
            fontSize: 13,
          }}
        >
          Loading jobs...
        </div>
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            padding: "16px",
          }}
        >
          <button
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>

          <span
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showAdd && (
        <FormModal
          title="Post New Job"
          subtitle="Create a new job opening for your team"
          fields={JOB_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handlePost}
          submitLabel="Post Job"
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
                x="2"
                y="5"
                width="14"
                height="12"
                rx="2"
              />
              <path d="M11 5V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1" />
            </svg>
          }
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Job"
          message="This will permanently delete the job from the database. Are you sure?"
          confirmLabel="Delete Job"
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