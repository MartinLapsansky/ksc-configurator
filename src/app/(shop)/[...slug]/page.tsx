import React from "react";
import { notFound } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CategoryCard, {
  type CategoryCardItem,
} from "@/components/shared/CategoryCard";
import ProductConfigurator from "@/features/configurator/components/ProductConfigurator";
import { getCategoryBySlug, getProductBySlug } from "@/lib/catalog";

type CatchAllPageProps = {
  params: Promise<{ slug: string[] }>;
};

/**
 * Data-driven shop router. Resolves the last path segment against the catalogue:
 * a product renders the configurator, a category renders its children/products.
 */
export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const lastSegment = slug[slug.length - 1] ?? "";

  const product = await getProductBySlug(lastSegment);

  if (product) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Breadcrumbs />
        <div className="p-4 md:p-8">
          <ProductConfigurator product={product} />
        </div>
      </main>
    );
  }

  const category = await getCategoryBySlug(lastSegment);

  if (category) {
    const cards: CategoryCardItem[] = [
      ...category.children.map((child) => ({
        id: child.id,
        title: child.name,
        buttonLabel: "Explore",
        href: `/${slug.join("/")}/${child.slug}`,
      })),
      ...category.products.map((item) => ({
        id: item.id,
        title: item.name,
        buttonLabel: "Customise",
        href: `/${slug.join("/")}/${item.slug}`,
      })),
    ];

    return (
      <main className="w-full min-h-screen bg-white">
        <TopBanner />
        <Breadcrumbs />
        <section className="w-full px-4 md:px-8 min-h-[70vh]">
          <CategoryCard cards={cards} />
        </section>
      </main>
    );
  }

  notFound();
}