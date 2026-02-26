import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4310;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root = ops-infra
const repoRoot = path.resolve(__dirname, "../..");
const docsDir = path.join(repoRoot, "docs");

// Frontend build location
const webDist = path.join(repoRoot, "ops-dashboard", "web", "dist");

// Weekly logs only: filenames containing "weekly-log"
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
    if (name.includes("..") || name.includes("/")) return res.status(400).send("Bad request");

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
