/**
 * Generate a URL-safe slug from a string.
 * Handles unicode, multiple spaces, and special characters.
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique slug by appending a short random suffix.
 */
export function generateUniqueSlug(input: string): string {
  const base = generateSlug(input);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
}
