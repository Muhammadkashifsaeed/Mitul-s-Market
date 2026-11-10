import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let cachedWritableDir: string | null = null;

function ensureWritableDir(dirPath: string): boolean {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.accessSync(dirPath, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves a writable directory for JSON persistence and ephemeral signing keys.
 * Uses `process.env.DATA_DIR` or `<cwd>/.data` on writable Node hosts, and falls back
 * to `os.tmpdir()/mituls-market-data` on read-only serverless runtimes.
 */
export function resolveWritableDataDir(): string {
  if (cachedWritableDir) {
    return cachedWritableDir;
  }

  const candidates = [
    process.env.DATA_DIR?.trim(),
    path.join(process.cwd(), ".data"),
    path.join(os.tmpdir(), "mituls-market-data"),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (ensureWritableDir(candidate)) {
      cachedWritableDir = candidate;
      return candidate;
    }
  }

  const fallback = path.join(os.tmpdir(), "mituls-market-data");
  cachedWritableDir = fallback;
  return fallback;
}

