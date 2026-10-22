import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/features/admin/components/AdminDashboard";
import {
  buildCategoryWhere,
  buildProductWhere,
} from "@/features/admin/utils/buildCatalogWhere";
import type {
  AdminCategory,
  AdminProduct,
  CatalogFilterType,
  CategoryOption,
} from "@/features/admin/types";

const ITEMS_PER_PAGE = 10;

type AdminDashboardPageProps = {
  searchParams: Promise<{
    type?: string;
    q?: string;
    category?: string;
    page?: string;
  }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;

  const filterType: CatalogFilterType =
    params.type === "categories" || params.type === "products"
      ? params.type
      : "all";

  const query = params.q?.trim() || undefined;
  const categoryId = params.category || undefined;
  const currentPage = Math.max(Number(params.page) || 1, 1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const showCategories = filterType !== "products";
  const showProducts = filterType !== "categories";

  const categoryWhere = buildCategoryWhere(query);
  const productWhere = buildProductWhere(query, categoryId);

  const categoriesPromise: Promise<[AdminCategory[], number]> = showCategories
    ? Promise.all([
        prisma.category.findMany({
          where: categoryWhere,
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            parent: { select: { id: true, name: true, slug: true } },
            _count: { select: { children: true, products: true } },
          },
          skip,
          take: ITEMS_PER_PAGE,
        }),
        prisma.category.count({ where: categoryWhere }),
      ])
    : Promise.resolve([[], 0]);

  const productsPromise: Promise<[AdminProduct[], number]> = showProducts
    ? Promise.all([
        prisma.product.findMany({
          where: productWhere,
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            slug: true,
            active: true,
            hasBackView: true,
            coverImageUrl: true,
            frontImageUrl: true,
            category: { select: { id: true, name: true, slug: true } },
          },
          skip,
          take: ITEMS_PER_PAGE,
        }),
        prisma.product.count({ where: productWhere }),
      ])
    : Promise.resolve([[], 0]);

  const categoriesOptionsPromise: Promise<CategoryOption[]> = prisma.category
    .findMany({
      where: { parentId: { not: null } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        parent: { select: { name: true } },
      },
    })
    .then((categories) =>
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        parentName: category.parent?.name ?? null,
      })),
    );

  const [categoriesResult, productsResult, categoryOptions] = await Promise.all([
    categoriesPromise,
    productsPromise,
    categoriesOptionsPromise,
  ]);

  const [categories, categoryTotal] = categoriesResult;
  const [products, productTotal] = productsResult;

  const categoryTotalPages = Math.ceil(categoryTotal / ITEMS_PER_PAGE);
  const productTotalPages = Math.ceil(productTotal / ITEMS_PER_PAGE);

  return (
    <AdminDashboard
      categories={categories}
      products={products}
      categoryOptions={categoryOptions}
      filterType={filterType}
      query={query ?? ""}
      categoryId={categoryId ?? ""}
      currentPage={currentPage}
      categoryTotalPages={categoryTotalPages}
      productTotalPages={productTotalPages}
      showCategories={showCategories}
      showProducts={showProducts}
    />
  );
}