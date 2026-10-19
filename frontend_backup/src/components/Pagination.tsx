interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  total: number;
  pageSize: number;
}

export default function Pagination({ page, totalPages, onPageChange, total, pageSize }: PaginationProps) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid var(--border-light)", gap: 12 }}>
      <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
        Showing <strong style={{ color: "var(--text)", fontWeight: 600 }}>{start}–{end}</strong> of <strong style={{ color: "var(--text)", fontWeight: 600 }}>{total}</strong> results
      </span>
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <PageBtn onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="10" height="10"><polyline points="8,2 4,6 8,10"/></svg>
        </PageBtn>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} style={{ width: 28, textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>…</span>
          ) : (
            <PageBtn key={p} onClick={() => onPageChange(p as number)} active={page === p}>
              {p}
            </PageBtn>
          )
        )}
        <PageBtn onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="10" height="10"><polyline points="4,2 8,6 4,10"/></svg>
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, onClick, active, disabled }: {
  children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30, height: 30, borderRadius: 7, border: "1px solid",
        borderColor: active ? "var(--accent)" : "var(--border)",
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#fff" : disabled ? "var(--text-tertiary)" : "var(--text-secondary)",
        fontSize: 12.5, fontWeight: active ? 700 : 500, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.12s ease", opacity: disabled ? 0.4 : 1,
      }}
    >{children}</button>
  );
}
