export const normalizePath = (path: string): string =>
  // remove trailing slash from BASE_URL first as our path starts with a leading slash
  // Next remove trailing slash from final path as raviger doesn't like trailing slashes
  (import.meta.env.BASE_URL.replace(/\/$/, "") + path).replace(/\/$/, "");
