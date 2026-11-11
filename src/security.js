// Defence in depth: React already escapes text, but we also validate every input.
export const clean = (s, max = 120) =>
  String(s ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export const safeUrl = (u) => {
  try {
    const x = new URL(String(u).trim());
    return x.protocol === "https:" || x.protocol === "http:" ? x.href : null;
  } catch {
    return null;
  }
};

export const FILE_RULES = {
  maxBytes: 5 * 1024 * 1024,
  types: { "application/pdf": ".pdf", "image/png": ".png", "image/jpeg": ".jpg", "text/plain": ".txt" },
};

export function validateFile(file) {
  if (!file) return null;
  const ext = FILE_RULES.types[file.type];
  if (!ext) return "Only PDF, PNG, JPG or TXT files are allowed.";
  if (!file.name.toLowerCase().endsWith(ext) && !(ext === ".jpg" && file.name.toLowerCase().endsWith(".jpeg")))
    return "File extension does not match its type.";
  if (file.size > FILE_RULES.maxBytes) return "File must be under 5 MB.";
  return null;
}

export const inRange = (n, lo, hi) => Number.isInteger(n) && n >= lo && n <= hi;

// Sliding-window limiter: allows `limit` actions per `windowMs`.
export function makeLimiter(limit, windowMs) {
  const hits = [];
  return () => {
    const now = Date.now();
    while (hits.length && now - hits[0] > windowMs) hits.shift();
    if (hits.length >= limit) return false;
    hits.push(now);
    return true;
  };
}
