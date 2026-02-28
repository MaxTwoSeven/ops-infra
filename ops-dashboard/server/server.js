import express from "express";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4310;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root = ops-infra
const repoRoot = path.resolve(__dirname, "../..");
const docsDir = path.join(repoRoot, "docs");

// Dashboard system docs live here:
const systemDocsDir = path.join(repoRoot, "ops-dashboard", "docs", "system");

// Frontend build location
const webDist = path.join(repoRoot, "ops-dashboard", "web", "dist");

function safeJoin(base, target) {
  const targetPath = path.resolve(base, target);
  if (!targetPath.startsWith(base)) {
    throw new Error("Refusing path traversal");
  }
  return targetPath;
}

// --- Docs API (System documentation) ---
app.get("/api/docs/list", async (_req, res) => {
  try {
    const files = await fsp.readdir(systemDocsDir);
    const allowed = files.filter((f) => f.endsWith(".md") || f.endsWith(".mmd"));
    res.json({ root: "system", files: allowed.sort() });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/docs/:name", async (req, res) => {
  try {
    const name = req.params.name;
    if (!(name.endsWith(".md") || name.endsWith(".mmd"))) {
      return res.status(400).send("Unsupported file type");
    }
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      return res.status(400).send("Bad request");
    }

    const filePath = safeJoin(systemDocsDir, name);
    const content = await fsp.readFile(filePath, "utf-8");
    res.type("text/plain").send(content);
  } catch (err) {
    res.status(404).json({ error: String(err) });
  }
});

// --- Weekly logs API (from repo /docs) ---
// Currently filters filenames containing "weekly-log"
app.get("/api/logs", (_req, res) => {
  try {
    if (!fs.existsSync(docsDir)) return res.json([]);

    const files = fs
      .readdirSync(docsDir)
      .filter((f) => f.endsWith(".md") && f.includes("weekly-log"))
      .sort()
      .reverse();

    res.json(files);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/api/logs/:name", (req, res) => {
  try {
    const name = req.params.name;

    if (!name.endsWith(".md")) return res.status(400).send("Bad request");
    if (!name.includes("weekly-log")) return res.status(400).send("Bad request");
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      return res.status(400).send("Bad request");
    }

    const filePath = path.join(docsDir, name);
    if (!fs.existsSync(filePath)) return res.status(404).send("Not found");

    const content = fs.readFileSync(filePath, "utf8");
    res.type("text/markdown").send(content);
  } catch (e) {
    res.status(500).send(String(e));
  }
});

// Serve built frontend if present
app.use(express.static(webDist));
app.get(/.*/, (_req, res) => {
  const indexPath = path.join(webDist, "index.html");
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(200).send("Web UI not built yet. Build ops-dashboard/web first.");
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Ops dashboard running on http://localhost:${PORT}`);
});
