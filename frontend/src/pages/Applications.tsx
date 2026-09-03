import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";

import {
  getApplications,
  createApplication,
  deleteApplication,
} from "../api/applications";

import type {
  Application,
  CreateApplicationData,
} from "../api/applications";

import { getCandidates } from "../api/candidates";
import { getJobs } from "../api/jobs";

import type { Candidate } from "../api/candidates";
import type { Job } from "../api/jobs";

import Card from "../components/Card";
import Badge from "../components/Badge";
import FormModal, {
  ConfirmDialog,
  Toast,
} from "../components/FormModal";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

import ApplicationDetail from "./ApplicationDetail";

const PAGE_SIZE = 7;

const statuses = [
  "all",
  "Applied",
  "Screened",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Offered",
  "Joined",
  "Rejected",
  "Withdrawn",
];

interface ApplicationsProps {
  candidateId?: string | null;
}

interface App {
  id: string;
  candidate: string;
  candidateId: string;
  job: string;
  jobId: string;
  recruiter: string;
  source: string;
  status: string;
  matchScore: number;
  appliedDate: string;
  joiningDate: string | null;
  dept: string;
  interviewScore: number | null;
  offerStatus: string | null;
  cost: number;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toUiApplication(application: Application): App {
  return {
    id: application.applicationId,

    candidate:
      application.candidate?.candidateName ??
      application.candidateId,

    candidateId: application.candidateId,

    job:
      application.job?.jobTitle ??
      application.jobId,

    jobId: application.jobId,

    recruiter:
      application.recruiter?.recruiterName ??
      (application.recruiterId !== null
        ? `Recruiter #${application.recruiterId}`
        : "—"),

    source:
      application.source?.sourceName ??
      (application.sourceId !== null
        ? `Source #${application.sourceId}`
        : "—"),

    status: (
      application.status ?? "Applied"
    ).toLowerCase(),

    matchScore: Number(
      application.matchScore ?? 0,
    ),

    appliedDate: formatDate(
      application.applicationDate,
    ),

    joiningDate: application.joiningDate
      ? formatDate(application.joiningDate)
      : null,

    dept:
      application.job?.department ?? "—",

    interviewScore: null,

    offerStatus:
      application.offerDate !== null
        ? "offered"
        : null,

    cost: Number(
      application.recruitmentCost ?? 0,
    ),
  };
}

export default function Applications({
  candidateId,
}: ApplicationsProps) {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [formLoading, setFormLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState<App | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Application | null>(null);

  const [toast, setToast] =
    useState<{
      message: string;
      type: "success" | "error" | "info";
    } | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
  await getApplications(
    page,
    PAGE_SIZE,
    search,
    candidateId ?? "",
  );

      setApplications(response.data);
      setTotal(response.meta.total);
      setTotalPages(
        response.meta.totalPages,
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
  try {
    const firstCandidatePage = await getCandidates(1, 100);
    const firstJobPage = await getJobs(1, 100);

    const candidateRequests = [];
    for (
      let page = 2;
      page <= firstCandidatePage.meta.totalPages;
      page++
    ) {
      candidateRequests.push(getCandidates(page, 100));
    }

    const jobRequests = [];
    for (
      let page = 2;
      page <= firstJobPage.meta.totalPages;
      page++
    ) {
      jobRequests.push(getJobs(page, 100));
    }

    const [candidatePages, jobPages] = await Promise.all([
      Promise.all(candidateRequests),
      Promise.all(jobRequests),
    ]);

    const allCandidates = [
      ...firstCandidatePage.data,
      ...candidatePages.flatMap((page) => page.data),
    ];

    const allJobs = [
      ...firstJobPage.data,
      ...jobPages.flatMap((page) => page.data),
    ];

    setCandidates(allCandidates);
    setJobs(allJobs);
  } catch (err) {
    console.error(err);

    setToast({
      message: "Could not load candidates or jobs.",
      type: "error",
    });
  }
};
 useEffect(() => {
  loadApplications();
}, [page, search, candidateId]);

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer =
      window.setTimeout(() => {
        setToast(null);
      }, 4000);

    return () =>
      window.clearTimeout(timer);
  }, [toast]);

  const uiApplications = useMemo(() => {
    return applications.map(
      toUiApplication,
    );
  }, [applications]);

  const filteredApplications =
    useMemo(() => {
      if (statusFilter === "all") {
        return uiApplications;
      }

      return uiApplications.filter(
        (application) =>
          application.status.toLowerCase() ===
          statusFilter.toLowerCase(),
      );
    }, [
      uiApplications,
      statusFilter,
    ]);

  const handleSearch = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (
    status: string,
  ) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleAdd = async (
    data: Record<string, string>,
  ) => {
    try {
      setFormLoading(true);

      const candidateValue = data.candidateId;
const jobValue = data.jobId;

const candidateId =
  candidates.find(
    (candidate) =>
      `${candidate.candidateName} (${candidate.candidateId})` ===
      candidateValue,
  )?.candidateId ?? "";

const jobId =
  jobs.find(
    (job) =>
      `${job.jobTitle} (${job.jobId})` ===
      jobValue,
  )?.jobId ?? "";

      if (!candidateId || !jobId) {
        setToast({
          message:
            "Please select a candidate and job.",
          type: "error",
        });

        return;
      }

      const payload: CreateApplicationData =
        {
          candidateId,
          jobId,

          recruiterId:
            data.recruiterId
              ? Number(data.recruiterId)
              : undefined,

          sourceId:
            data.sourceId
              ? Number(data.sourceId)
              : undefined,

          applicationDate:
            data.applicationDate ||
            undefined,

          status:
            data.status || undefined,

          matchScore:
            data.matchScore
              ? Number(data.matchScore)
              : undefined,

          recruitmentCost:
            data.recruitmentCost
              ? Number(
                  data.recruitmentCost,
                )
              : undefined,
        };

      await createApplication(
        payload,
      );

      setShowAddModal(false);

      setToast({
        message:
          "Application created successfully.",
        type: "success",
      });

      setPage(1);

      await loadApplications();
    } catch (err) {
      console.error(err);

      let message =
        "Failed to create application.";

      if (err instanceof Error) {
        try {
          const parsed =
            JSON.parse(err.message);

          if (
            typeof parsed?.message ===
            "string"
          ) {
            message = parsed.message;
          } else if (
            Array.isArray(
              parsed?.message,
            )
          ) {
            message =
              parsed.message.join(
                ", ",
              );
          }
        } catch {
          if (err.message) {
            message = err.message;
          }
        }
      }

      setToast({
        message,
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteApplication(
        deleteTarget.applicationId,
      );

      setDeleteTarget(null);

      setToast({
        message:
          `Application #${deleteTarget.applicationId} deleted.`,
        type: "success",
      });

      if (
        applications.length === 1 &&
        page > 1
      ) {
        setPage(
          (current) => current - 1,
        );
      } else {
        await loadApplications();
      }
    } catch (err) {
      console.error(err);

      setToast({
        message:
          "Failed to delete application.",
        type: "error",
      });
    }
  };

  if (selectedApplication) {
    return (
      <ApplicationDetail
        app={selectedApplication}
        onBack={() =>
          setSelectedApplication(null)
        }
      />
    );
  }

  return (
    <div
      className="fade-in"
      style={{
        padding:
          "24px 24px 48px",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--text)",
              margin: 0,
              letterSpacing:
                "-0.5px",
            }}
          >
            Applications
          </h1>

          <p
            style={{
              fontSize: 13,
              color:
                "var(--text-secondary)",
              margin:
                "4px 0 0",
            }}
          >
            Manage and track candidate
            applications
          </p>
        </div>

        <button
          onClick={() =>
            setShowAddModal(true)
          }
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: 7,
            padding:
              "8px 14px",
            borderRadius: 8,
            border: "none",
            background:
              "var(--accent)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily:
              "inherit",
            boxShadow:
              "var(--shadow-accent)",
          }}
        >
          <Plus size={15} />
          Add Application
        </button>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            padding:
              "10px 14px",
            marginBottom: 14,
            borderRadius: 8,
            background:
              "var(--red-light)",
            color:
              "var(--red)",
            border:
              "1px solid var(--red-border)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Filters */}

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 16,
            flexWrap:
              "wrap",
          }}
        >
          <SearchBar
            value={search}
            onChange={
              handleSearch
            }
            placeholder="Search applications..."
            width={280}
          />

          <div
            style={{
              display: "flex",
              gap: 5,
              flexWrap:
                "wrap",
            }}
          >
            {statuses.map(
              (status) => {
                const active =
                  statusFilter ===
                  status;

                return (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusFilter(
                        status,
                      )
                    }
                    style={{
                      padding:
                        "6px 10px",
                      borderRadius:
                        7,
                      border:
                        `1px solid ${
                          active
                            ? "var(--accent)"
                            : "var(--border)"
                        }`,
                      background:
                        active
                          ? "var(--accent)"
                          : "transparent",
                      color:
                        active
                          ? "#fff"
                          : "var(--text-secondary)",
                      fontSize:
                        11.5,
                      fontWeight:
                        active
                          ? 700
                          : 500,
                      cursor:
                        "pointer",
                      fontFamily:
                        "inherit",
                    }}
                  >
                    {status ===
                    "all"
                      ? "All"
                      : status}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </Card>

      {/* Table */}

      <div
        style={{
          marginTop: 14,
        }}
      >
        <Card>
          {loading ? (
            <div
              style={{
                padding:
                  "50px 20px",
                textAlign:
                  "center",
                color:
                  "var(--text-tertiary)",
                fontSize: 13,
              }}
            >
              Loading applications...
            </div>
          ) : filteredApplications.length ===
            0 ? (
            <div
              style={{
                padding:
                  "50px 20px",
                textAlign:
                  "center",
                color:
                  "var(--text-tertiary)",
                fontSize: 13,
              }}
            >
              No applications found.
            </div>
          ) : (
            <>
              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Candidate",
                        "Position",
                        "Recruiter",
                        "Source",
                        "Status",
                        "Match",
                        "Joining",
                        "Action",
                      ].map(
                        (heading) => (
                          <th
                            key={
                              heading
                            }
                            style={{
                              padding:
                                "11px 14px",
                              textAlign:
                                "left",
                              fontSize:
                                10.5,
                              fontWeight:
                                700,
                              color:
                                "var(--text-tertiary)",
                              textTransform:
                                "uppercase",
                              letterSpacing:
                                "0.5px",
                              borderBottom:
                                "1px solid var(--border-light)",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map(
                      (app) => (
                        <tr
                          key={
                            app.id
                          }
                        >
                          <td
                            style={{
                              padding:
                                "13px 14px",
                              fontSize:
                                12,
                              fontFamily:
                                "var(--font-mono)",
                              color:
                                "var(--text-secondary)",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            #{app.id}
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  13,
                                fontWeight:
                                  650,
                                color:
                                  "var(--text)",
                              }}
                            >
                              {
                                app.candidate
                              }
                            </div>

                            <div
                              style={{
                                fontSize:
                                  10.5,
                                color:
                                  "var(--text-tertiary)",
                                marginTop:
                                  2,
                                fontFamily:
                                  "var(--font-mono)",
                              }}
                            >
                              {
                                app.candidateId
                              }
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  13,
                                fontWeight:
                                  600,
                                color:
                                  "var(--text)",
                              }}
                            >
                              {app.job}
                            </div>

                            <div
                              style={{
                                fontSize:
                                  10.5,
                                color:
                                  "var(--text-tertiary)",
                                marginTop:
                                  2,
                              }}
                            >
                              {
                                app.dept
                              }
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              fontSize:
                                12.5,
                              color:
                                "var(--text-secondary)",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            {
                              app.recruiter
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              fontSize:
                                12.5,
                              color:
                                "var(--text-secondary)",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            {
                              app.source
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            <Badge
                              status={
                                app.status
                              }
                              size="md"
                              dot
                            />
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              fontSize:
                                12.5,
                              fontWeight:
                                700,
                              color:
                                "var(--text)",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            {
                              app.matchScore
                            }
                            %
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              fontSize:
                                12,
                              color:
                                "var(--text-secondary)",
                              borderBottom:
                                "1px solid var(--border-light)",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              app.joiningDate ??
                              "—"
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "13px 14px",
                              borderBottom:
                                "1px solid var(--border-light)",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: 4,
                              }}
                            >
                              <button
                                onClick={() =>
                                  setSelectedApplication(
                                    app,
                                  )
                                }
                                title="View application"
                                style={{
                                  width:
                                    30,
                                  height:
                                    30,
                                  borderRadius:
                                    7,
                                  border:
                                    "1px solid var(--border)",
                                  background:
                                    "transparent",
                                  color:
                                    "var(--text-secondary)",
                                  cursor:
                                    "pointer",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                }}
                              >
                                <Eye
                                  size={
                                    14
                                  }
                                />
                              </button>

                              <button
                                onClick={() => {
                                  const original =
                                    applications.find(
                                      (
                                        item,
                                      ) =>
                                        item.applicationId ===
                                        app.id,
                                    );

                                  if (
                                    original
                                  ) {
                                    setDeleteTarget(
                                      original,
                                    );
                                  }
                                }}
                                title="Delete application"
                                style={{
                                  width:
                                    30,
                                  height:
                                    30,
                                  borderRadius:
                                    7,
                                  border:
                                    "1px solid var(--border)",
                                  background:
                                    "transparent",
                                  color:
                                    "var(--red)",
                                  cursor:
                                    "pointer",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                }}
                              >
                                <Trash2
                                  size={
                                    14
                                  }
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={page}
                totalPages={
                  totalPages
                }
                onPageChange={
                  setPage
                }
                total={total}
                pageSize={
                  PAGE_SIZE
                }
              />
            </>
          )}
        </Card>
      </div>

      {/* Add Application */}

      {showAddModal && (
        <FormModal
          title="Add Application"
          subtitle="Create a new candidate application"
          fields={[
            {
              key:
                "candidateId",
              label:
                "Candidate",
              type:
                "select",
             options: candidates.map(
  (candidate) =>
    `${candidate.candidateName} (${candidate.candidateId})`,
),
              required:
                true,
            },

            {
              key:
                "jobId",
              label:
                "Job",
              type:
                "select",
              options: jobs.map(
  (job) =>
    `${job.jobTitle} (${job.jobId})`,
),
              required:
                true,
            },

            {
              key:
                "recruiterId",
              label:
                "Recruiter ID",
              type:
                "number",
              placeholder:
                "e.g. 1",
              required:
                false,
            },

            {
              key:
                "sourceId",
              label:
                "Source ID",
              type:
                "number",
              placeholder:
                "e.g. 1",
              required:
                false,
            },

            {
              key:
                "applicationDate",
              label:
                "Application Date",
              type:
                "date",
              required:
                false,
            },

            {
              key:
                "status",
              label:
                "Status",
              type:
                "select",
             options: statuses.filter(
  (status) => status !== "all",
),
              required:
                false,
            },

            {
              key:
                "matchScore",
              label:
                "Match Score",
              type:
                "number",
              placeholder:
                "0–100",
              required:
                false,
            },

            {
              key:
                "recruitmentCost",
              label:
                "Recruitment Cost",
              type:
                "number",
              placeholder:
                "e.g. 5000",
              required:
                false,
            },
          ]}
          submitLabel={
            formLoading
              ? "Creating..."
              : "Create Application"
          }
          onSubmit={
            handleAdd
          }
          onClose={() =>
            !formLoading &&
            setShowAddModal(false)
          }
        />
      )}

      {/* Delete confirmation */}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Application?"
          message={
            `Are you sure you want to delete application #${deleteTarget.applicationId}? This action cannot be undone.`
          }
          confirmLabel="Delete"
          danger
          onConfirm={
            handleDelete
          }
          onCancel={() =>
            setDeleteTarget(null)
          }
        />
      )}

      {/* Toast */}

      {toast && (
        <Toast
          message={
            toast.message
          }
          type={
            toast.type
          }
          onClose={() =>
            setToast(null)
          }
        />
      )}
    </div>
  );
}