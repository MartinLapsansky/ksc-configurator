export interface BreadcrumbEntry {
  label: string;
  href: string;
}

/**
 * Optional overrides for route segments whose display label cannot be produced
 * by title-casing the slug alone (acronyms, irregular capitalization, etc.).
 *
 * Most segments — including product slugs like "jersey-design-146" or
 * "soul-half-zip" — need NO entry here: they are derived automatically by
 * `titleCase` below. Adding new products (even hundreds of jerseys) does not
 * require touching this file.
 */
const SEGMENT_LABELS: Record<string, string> = {
  gaa: "GAA",
  kcs: "KCS",
};

function titleCase(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Builds the breadcrumb trail from a pathname. Returns a single "Home" crumb
 * for the home page (or an empty path).
 */
export function getBreadcrumbItems(pathname: string): BreadcrumbEntry[] {
  if (!pathname || pathname === "/") {
    return [{ label: "Home", href: "/" }];
  }

  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbEntry[] = [{ label: "Home", href: "/" }];

  segments.forEach((segment, index) => {
    items.push({
      label: SEGMENT_LABELS[segment] ?? titleCase(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    });
  });

  return items;
}