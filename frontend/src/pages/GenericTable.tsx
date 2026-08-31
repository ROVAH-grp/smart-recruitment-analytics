import { useState, type ReactNode } from "react";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { TableRowSkeleton } from "../components/Skeleton";

const PAGE_SIZE = 8;

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: number;
}

interface GenericTableProps<T extends Record<string, unknown>> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  addLabel?: string;
  searchKeys?: string[];
  loading?: boolean;
  onAddClick?: () => void;
}

export default function GenericTable<T extends Record<string, unknown>>({
  title, subtitle, data, columns, addLabel, searchKeys = [], loading = false, onAddClick,
}: GenericTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = search && searchKeys.length
    ? data.filter(row => searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(search.toLowerCase())))
    : data;

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortCol] ?? ""), bv = String(b[sortCol] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  return (
    <div className="fade-in" style={{ padding: "24px 24px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 3px", letterSpacing: "-0.5px" }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0 }}>{subtitle}</p>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {searchKeys.length > 0 && (
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={`Search ${title.toLowerCase()}…`} />
          )}
          {addLabel && (
            <button
              onClick={onAddClick}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 2px 10px var(--accent-shadow)", transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-dark)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"}
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      cursor: col.sortable === false ? "default" : "pointer",
                      whiteSpace: "nowrap",
                      width: col.width,
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase", color: sortCol === col.key ? "var(--accent)" : "var(--text-secondary)" }}>
                        {col.label}
                      </span>
                      {col.sortable !== false && (
                        <span style={{ fontSize: 9, color: sortCol === col.key ? "var(--accent)" : "var(--text-tertiary)", opacity: sortCol === col.key ? 1 : 0.4 }}>
                          {sortCol === col.key && sortDir === "desc" ? "▼" : "▲"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={columns.length} />)
              ) : paginated.length === 0 ? (
                <tr><td colSpan={columns.length}>
                  <EmptyState
                    title={`No ${title.toLowerCase()} found`}
                    description={search ? "Try adjusting your search term." : `No ${title.toLowerCase()} have been added yet.`}
                    action={search ? { label: "Clear search", onClick: () => setSearch("") } : undefined}
                  />
                </td></tr>
              ) : paginated.map((row, i) => (
                <tr
                  key={String(row.id ?? i)}
                  style={{ borderBottom: i < paginated.length - 1 ? "1px solid var(--border-light)" : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: "12px 16px", fontSize: 13, color: "var(--text)" }}>
                      {col.render ? col.render(row) : (
                        <span style={{ color: row[col.key] == null ? "var(--text-tertiary)" : "var(--text)" }}>
                          {String(row[col.key] ?? "—")}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={sorted.length} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
