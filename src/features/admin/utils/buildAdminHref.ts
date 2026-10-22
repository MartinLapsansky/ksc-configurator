import type { CatalogFilterType } from "@/features/admin/types";

export type AdminFilterParams = {
  page?: number;
  type?: CatalogFilterType;
  q?: string;
  category?: string;
};

/**
 * Builds the `/admin` URL with the given filter/search-param values, skipping
 * empty/default values so the URL stays clean.
 */
export function buildAdminHref(params: AdminFilterParams): string {
  const searchParams = new URLSearchParams();

  if (params.type && params.type !== "all") {
    searchParams.set("type", params.type);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();
  return query ? `/admin?${query}` : "/admin";
}