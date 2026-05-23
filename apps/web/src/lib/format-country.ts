let displayNames: Intl.DisplayNames | null = null;

function getDisplayNames() {
  if (displayNames) return displayNames;
  try {
    displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    displayNames = null;
  }
  return displayNames;
}

export function formatCountry(code: string | null | undefined): string {
  if (!code) return "Unknown";
  const trimmed = code.trim();
  if (!trimmed || trimmed.toLowerCase() === "unknown") return "Unknown";

  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    const upper = trimmed.toUpperCase();
    const name = getDisplayNames()?.of(upper);
    if (name && name !== upper) return `${upper} - ${name}`;
    return upper;
  }

  return trimmed;
}
