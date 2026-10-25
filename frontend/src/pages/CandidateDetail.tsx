import { useEffect, useRef, useState } from "react";
import { getCandidate, type Candidate } from "../api/candidates";
import {
  deleteResume,
  getResume,
  uploadResume,
  type Resume,
} from "../api/resumes";
import Card from "../components/Card";
import Badge from "../components/Badge";

interface CandidateDetailProps {
  candidateId: string;
  onBack: () => void;
  onViewApplications: (candidateId: string) => void;
}

export default function CandidateDetail({
  candidateId,
  onBack,
  onViewApplications,
}: CandidateDetailProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);

  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);

  const [error, setError] = useState("");
  const [resumeError, setResumeError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCandidate(candidateId);
        setCandidate(data);
      } catch (err) {
        console.error("Failed to load candidate:", err);
        setError("Unable to load candidate profile.");
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [candidateId]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setResumeLoading(true);
        setResumeError("");

        const data = await getResume(candidateId);
        setResume(data);
      } catch (err) {
        console.error("Failed to load resume:", err);
        setResumeError("Unable to load resume information.");
      } finally {
        setResumeLoading(false);
      }
    };

    loadResume();
  }, [candidateId]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setResumeError("");

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".docx"];

    const filename = file.name.toLowerCase();

    const validType =
      allowedTypes.includes(file.type) ||
      allowedExtensions.some((extension) =>
        filename.endsWith(extension),
      );

    if (!validType) {
      setResumeError("Only PDF and DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError("Resume must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadedResume = await uploadResume(
        candidateId,
        file,
      );

      setResume(uploadedResume);
    } catch (err) {
      console.error("Failed to upload resume:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload resume.";

      setResumeError(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteResume = async () => {
    if (!resume) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setResumeError("");

      await deleteResume(candidateId);

      setResume(null);
    } catch (err) {
      console.error("Failed to delete resume:", err);
      setResumeError("Failed to delete resume.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 28,
          color: "var(--text-secondary)",
        }}
      >
        Loading candidate profile...
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div style={{ padding: 28 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
            color: "var(--text)",
            fontFamily: "inherit",
          }}
        >
          ← Back to Candidates
        </button>

        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-secondary)",
          }}
        >
          {error || "Candidate not found."}
        </div>
      </div>
    );
  }

  const initials = candidate.candidateName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hue =
    (candidate.candidateName.charCodeAt(0) * 47 +
      (candidate.candidateName.charCodeAt(1) || 0) * 13) %
    360;

  const experience =
    candidate.experienceYears !== null &&
    candidate.experienceYears !== undefined
      ? `${candidate.experienceYears} years`
      : "Not specified";

  const createdDate = candidate.createdAt
    ? new Date(candidate.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      )
    : "—";

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const resumeDate = resume?.uploadedAt
    ? new Date(resume.uploadedAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      )
    : "";

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          border: "none",
          background: "transparent",
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          padding: "4px 0",
          marginBottom: 18,
          fontFamily: "inherit",
        }}
      >
        ← Back to Candidates
      </button>

      {/* Profile Header */}
      <Card
        style={{
          padding: 24,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: `hsl(${hue},55%,92%)`,
                color: `hsl(${hue},55%,35%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {initials}
            </div>

            <div>
              <div
                style={{
                  fontSize: 23,
                  fontWeight: 750,
                  color: "var(--text)",
                  marginBottom: 5,
                }}
              >
                {candidate.candidateName}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                  }}
                >
                  {candidate.candidateId}
                </span>

                <Badge status="applied" dot />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 9,
            }}
          >
            <button
              type="button"
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 12.5,
              }}
            >
              Edit Profile
            </button>

            <button
  onClick={() => onViewApplications(candidateId)}
  style={{
    borderRadius: 8,
    border: "none",
    background: "var(--primary)",
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 650,
    fontSize: 12.5,
  }}
>
  View Applications
</button>
          </div>
        </div>
      </Card>

      {/* Personal + Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        <Card style={{ padding: 22 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 18,
            }}
          >
            Personal Information
          </div>

          <InfoRow
            label="Candidate ID"
            value={candidate.candidateId}
            mono
          />

          <InfoRow
            label="Full Name"
            value={candidate.candidateName}
          />

          <InfoRow
            label="Education"
            value={
              candidate.education || "Not specified"
            }
          />

          <InfoRow
            label="Experience"
            value={experience}
          />
        </Card>

        <Card style={{ padding: 22 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 18,
            }}
          >
            Candidate Overview
          </div>

          <InfoRow
            label="Profile Created"
            value={createdDate}
          />

          <InfoRow
            label="Current Status"
            value="Applied"
          />

          <InfoRow
            label="Resume"
            value={
              resumeLoading
                ? "Checking..."
                : resume
                  ? "Connected"
                  : "No resume connected"
            }
          />

          <InfoRow
            label="Applications"
            value="View application history"
          />
        </Card>
      </div>

      {/* Resume */}
      <Card
        style={{
          padding: 22,
          marginTop: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 5,
              }}
            >
              Resume
            </div>

            <div
              style={{
                fontSize: 12,
                color: "var(--text-tertiary)",
              }}
            >
              PDF or DOCX • Maximum 5 MB
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              cursor: uploading
                ? "not-allowed"
                : "pointer",
              fontFamily: "inherit",
              fontWeight: 650,
              fontSize: 12.5,
              opacity: uploading ? 0.65 : 1,
            }}
          >
            {uploading
              ? "Uploading..."
              : resume
                ? "Replace Resume"
                : "Upload Resume"}
          </button>
        </div>

        {resumeLoading ? (
          <div
            style={{
              padding: 20,
              border: "1px dashed var(--border)",
              borderRadius: 10,
              color: "var(--text-tertiary)",
              fontSize: 12.5,
            }}
          >
            Checking for an existing resume...
          </div>
        ) : resume ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: 16,
              border: "1px solid var(--border)",
              borderRadius: 10,
              background: "var(--bg)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  fontSize: 20,
                }}
              >
                📄
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 650,
                    color: "var(--text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 500,
                  }}
                >
                  {resume.originalFilename}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--text-tertiary)",
                    marginTop: 4,
                  }}
                >
                  {resume.mimeType.includes("pdf")
                    ? "PDF"
                    : "DOCX"}{" "}
                  • {formatFileSize(resume.fileSize)}
                  {resumeDate
                    ? ` • Uploaded ${resumeDate}`
                    : ""}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  window.open(
                    resume.cloudinaryUrl,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: 7,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 11.5,
                }}
              >
                View Resume
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteResume}
                style={{
                  padding: "8px 12px",
                  borderRadius: 7,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-tertiary)",
                  cursor: deleting
                    ? "not-allowed"
                    : "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 11.5,
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 24,
              border: "1px dashed var(--border)",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 28,
                marginBottom: 8,
              }}
            >
              📄
            </div>

            <div
              style={{
                fontSize: 13,
                fontWeight: 650,
                color: "var(--text)",
                marginBottom: 5,
              }}
            >
              No resume connected
            </div>

            <div
              style={{
                fontSize: 11.5,
                color: "var(--text-tertiary)",
              }}
            >
              Upload the candidate's latest resume
              to keep their profile complete.
            </div>
          </div>
        )}

        {resumeError && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(220, 70, 70, 0.08)",
              border: "1px solid rgba(220, 70, 70, 0.2)",
              color: "#d65b5b",
              fontSize: 12,
            }}
          >
            {resumeError}
          </div>
        )}
      </Card>

      {/* Recruitment Activity */}
      <Card
        style={{
          padding: 22,
          marginTop: 18,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 5,
          }}
        >
          Recruitment Activity
        </div>

        <div
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            marginBottom: 20,
          }}
        >
          Candidate activity and recruitment progress
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--primary)",
              flexShrink: 0,
            }}
          />

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 650,
                color: "var(--text)",
              }}
            >
              Candidate profile created
            </div>

            <div
              style={{
                fontSize: 11.5,
                color: "var(--text-tertiary)",
                marginTop: 3,
              }}
            >
              {createdDate}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        padding: "11px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "var(--text-tertiary)",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: "var(--text)",
          textAlign: "right",
          fontFamily: mono
            ? "var(--font-mono)"
            : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}