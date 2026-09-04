interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number | string;
}

export default function SearchBar({ value, onChange, placeholder = "Search…", width = 240 }: SearchBarProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "7px 12px", width,
      transition: "border-color 0.15s, box-shadow 0.15s",
    }}>
      <svg viewBox="0 0 16 16" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <circle cx="7" cy="7" r="5"/><line x1="13" y1="13" x2="10" y2="10"/>
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "var(--text)", fontFamily: "inherit", width: "100%", letterSpacing: "-0.1px" }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", alignItems: "center", padding: 0 }}
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10">
            <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
          </svg>
        </button>
      )}
    </div>
  );
}
