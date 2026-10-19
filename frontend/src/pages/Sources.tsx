import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";
import {
  getSources,
  createSource,
  type Source,
} from "../api/sources";

const SOURCE_FIELDS = [
  {
    key: "sourceName",
    label: "Source Name",
    placeholder: "e.g. AngelList",
    required: true,
  },
];

export default function Sources() {
  const [list, setList] = useState<Source[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const loadSources = async () => {
    try {
      setLoading(true);

      const response = await getSources(1, 100);

      setList(response.data);
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Failed to load sources.",
        type: "error",
      });

      setTimeout(() => setToast(null), 3500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleAdd = async (data: Record<string, string>) => {
    try {
      await createSource({
        sourceName: data.sourceName,
      });

      setShowAdd(false);

      await loadSources();

      setToast({
        msg: `Source "${data.sourceName}" added!`,
        type: "success",
      });

      setTimeout(() => setToast(null), 3500);
    } catch (error) {
      console.error(error);

      setToast({
        msg: "Failed to add source.",
        type: "error",
      });

      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <>
      <GenericTable
        title="Sources"
        subtitle={
          loading
            ? "Loading sources..."
            : `${list.length} recruitment channels`
        }
        data={list as unknown as Record<string, unknown>[]}
        addLabel="Add Source"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "sources.csv",
            list as unknown as Record<string, unknown>[],
          )
        }
        searchKeys={["sourceName"]}
        columns={[
          {
            key: "sourceId",
            label: "ID",
            render: (r) => (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                }}
              >
                S{String(r.sourceId).padStart(3, "0")}
              </span>
            ),
          },

          {
            key: "sourceName",
            label: "Source",
            render: (r) => (
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {String(r.sourceName)}
              </span>
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
                  ? new Date(
                      String(r.createdAt),
                    ).toLocaleDateString()
                  : "—"}
              </span>
            ),
          },
        ]}
      />

      {showAdd && (
        <FormModal
          title="Add Source"
          subtitle="Track a new recruitment channel"
          fields={SOURCE_FIELDS}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
          submitLabel="Add Source"
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
              <circle cx="14" cy="4" r="2.5" />
              <circle cx="4" cy="9" r="2.5" />
              <circle cx="14" cy="14" r="2.5" />
              <line
                x1="6.5"
                y1="10.2"
                x2="11.5"
                y2="12.8"
              />
              <line
                x1="11.5"
                y1="5.2"
                x2="6.5"
                y2="7.8"
              />
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