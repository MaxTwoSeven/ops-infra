import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";

type DocsList = { root: string; files: string[] };

export default function SystemDocs() {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("reporting.md");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isMermaid = useMemo(() => selected.endsWith(".mmd"), [selected]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/docs/list");
        const data: DocsList = await r.json();
        setFiles(data.files);

        // default selection if file exists
        if (data.files.includes("reporting.md")) setSelected("reporting.md");
        else if (data.files.length) setSelected(data.files[0]);
      } catch (e: any) {
        setError(String(e));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const r = await fetch(`/api/docs/${encodeURIComponent(selected)}`);
        if (!r.ok) throw new Error(`Failed to load ${selected}: ${r.status}`);
        const text = await r.text();
        setContent(text);
      } catch (e: any) {
        setError(String(e));
      }
    })();
  }, [selected]);

  useEffect(() => {
    if (!isMermaid) return;
    // Render mermaid after content updates
    mermaid.initialize({ startOnLoad: false });
    const el = document.getElementById("mermaid-container");
    if (!el) return;
    el.innerHTML = `<pre class="mermaid">${content}</pre>`;
    mermaid.run({ nodes: [el] }).catch(() => {});
  }, [content, isMermaid]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    alert("Copied to clipboard");
  };

  return (
    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
      <aside style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>System Docs</div>

        <button onClick={copyToClipboard} style={{ width: "100%", marginBottom: 10 }}>
          Copy current doc
        </button>

        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Files</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f) => (
            <button
              key={f}
              onClick={() => setSelected(f)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: f === selected ? "#eee" : "white",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {error ? <div style={{ marginTop: 12, color: "crimson" }}>{error}</div> : null}
      </aside>

      <main style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{selected}</h2>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Source: <code>ops-dashboard/docs/system</code>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {isMermaid ? (
            <div id="mermaid-container" />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          )}
        </div>
      </main>
    </div>
  );
}
