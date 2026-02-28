import { useState } from "react";
import "./App.css";
import SystemDocs from "./SystemDocs";

type Tab = "dashboard" | "system";

function App() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div style={{ minHeight: "100vh", padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 14px",
          border: "1px solid #ddd",
          borderRadius: 14,
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18 }}>Ops Dashboard</div>

        <nav style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setTab("dashboard")}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: tab === "dashboard" ? "#eee" : "white",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab("system")}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: tab === "system" ? "#eee" : "white",
              cursor: "pointer",
            }}
          >
            System
          </button>
        </nav>
      </header>

      <main>
        {tab === "dashboard" ? (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Dashboard</h2>
            <p style={{ marginBottom: 0, opacity: 0.8 }}>
              Next: show weekly rollups, latest daily note, workflow status, and health checks.
            </p>
          </div>
        ) : (
          <SystemDocs />
        )}
      </main>
    </div>
  );
}

export default App;
