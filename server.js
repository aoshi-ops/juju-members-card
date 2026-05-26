import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { networkInterfaces } from "node:os";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf"
};

function localIpv4Addresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((item) => item?.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}

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
}).listen(port, "0.0.0.0", () => {
  console.log(`JUJU members local: http://localhost:${port}/member-card`);
  for (const address of localIpv4Addresses()) {
    console.log(`Phone/LAN URL: http://${address}:${port}/member-card`);
  }
});
