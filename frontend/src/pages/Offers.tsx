import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import GenericTable from "./GenericTable";
import FormModal, { Toast } from "../components/FormModal";
import { exportToCsv } from "../utils/exportCsv";

import {
  getOffers,
  createOffer,
  updateOffer,
} from "../api/offers";

import type { Offer } from "../api/offers";

const OFFER_FIELDS = [
  {
    key: "applicationId",
    label: "Application ID",
    placeholder: "e.g. 3049",
    required: true,
  },
  {
    key: "offerDate",
    label: "Offer Date",
    type: "date" as const,
    required: false,
  },
  {
    key: "offerStatus",
    label: "Offer Status",
    type: "select" as const,
    options: [
      "Pending",
      "Accepted",
      "Declined",
      "Withdrawn",
    ],
    required: false,
  },
];

function formatDate(date: string | null): string {
  if (!date) return "—";
  return date;
}

export default function Offers() {
  const [list, setList] = useState<Offer[]>([]);
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

  const loadOffers = async () => {
    try {
      setLoading(true);

      const response = await getOffers(1, 100);

      setList(response.data);
    } catch (error) {
      console.error(error);

      showToast(
        "Could not load offers.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleCreate = async (
    data: Record<string, string>,
  ) => {
    try {
     const created = await createOffer({
  applicationId: data.applicationId,
  offerDate:
    data.offerDate || undefined,
  offerStatus:
    data.offerStatus || "Pending",
});

setShowAdd(false);

await loadOffers();

showToast(
  `Offer created for application #${data.applicationId}.`,
);

      setShowAdd(false);

      showToast(
        `Offer created for application #${data.applicationId}.`,
      );
    } catch (error) {
      console.error(error);

      let message =
        "Failed to create offer.";

      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message);

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

  const handleRevoke = async (offer: Offer) => {
    try {
      const updated = await updateOffer(
        offer.offerId,
        {
          offerStatus: "Withdrawn",
        },
      );

      setList((previous) =>
        previous.map((item) =>
          item.offerId === updated.offerId
            ? updated
            : item,
        ),
      );

      showToast(
        `Offer #${offer.offerId} withdrawn.`,
        "success",
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to withdraw offer.",
        "error",
      );
    }
  };

  const pendingCount = list.filter(
    (offer) =>
      offer.offerStatus === "Pending",
  ).length;

  return (
    <>
      <GenericTable
        title="Offers"
        subtitle={
          loading
            ? "Loading offers..."
            : `${pendingCount} pending · ${list.length} loaded`
        }
        data={
          list as unknown as Record<
            string,
            unknown
          >[]
        }
        addLabel="Create Offer"
        onAddClick={() => setShowAdd(true)}
        onExport={() =>
          exportToCsv(
            "offers.csv",
            list as unknown as Record<
              string,
              unknown
            >[],
          )
        }
        searchKeys={[
          "offerId",
          "applicationId",
          "offerStatus",
        ]}
        columns={[
          {
            key: "offerId",
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
                {String(r.offerId)}
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
            key: "offerDate",
            label: "Offer Date",
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
                  r.offerDate as
                    | string
                    | null,
                )}
              </span>
            ),
          },
          {
            key: "offerStatus",
            label: "Status",
            render: (r) => (
              <Badge
                status={String(
                  r.offerStatus ||
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
              const offer = r as unknown as Offer;

              if (
                offer.offerStatus !==
                "Pending"
              ) {
                return null;
              }

              return (
                <button
                  onClick={() =>
                    handleRevoke(offer)
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
                  Revoke
                </button>
              );
            },
          },
        ]}
      />

      {showAdd && (
        <FormModal
          title="Create Offer"
          subtitle="Generate a new offer"
          fields={OFFER_FIELDS}
          onClose={() =>
            setShowAdd(false)
          }
          onSubmit={handleCreate}
          submitLabel="Create Offer"
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
              <polyline points="18,5 9,11.5 0,5" />
              <rect
                x="0"
                y="3"
                width="18"
                height="13"
                rx="2"
              />
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