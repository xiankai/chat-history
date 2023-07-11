import { BASE_URL } from "../constants";

export const normalizePath = (path: string): string => {
  // If the base url is /, then we don't need to do anything.
  if (BASE_URL === "/") return path;
  // If the path is /, then we need to remove the trailing slash from the base url.
  if (path === "/") return BASE_URL.replace(/\/$/, "");
  // Otherwise, we need to add the base url to the path.
  return `${BASE_URL.replace(/\/$/, "")}${path}`;
};
