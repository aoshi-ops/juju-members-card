import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

function fileFor(url) {
  const path = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const direct = normalize(path === "/" ? "/index.html" : path);
  if (direct.includes("..")) return null;
  const ext = extname(direct);
  if (ext) return join(root, direct);
  return join(root, "index.html");
}

createServer(async (req, res) => {
  const file = fileFor(req.url || "/");
  if (!file) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    res.writeHead(200, { "Content-Type": types[".html"], "Cache-Control": "no-store" });
    res.end(body);
  }
}).listen(port, () => {
  console.log(`cafeジュジュ メンバーズカード: http://localhost:${port}`);
});
