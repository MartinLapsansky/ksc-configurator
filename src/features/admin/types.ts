export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  parent?: { id: string; name: string; slug: string } | null;
  _count?: { children: number; products: number };
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  hasBackView: boolean;
  coverImageUrl?: string | null;
  frontImageUrl?: string | null;
  category?: { id: string; name: string; slug: string } | null;
};

export type CatalogFilterType = "all" | "categories" | "products";

export type CategoryOption = {
  id: string;
  name: string;
  parentName: string | null;
};