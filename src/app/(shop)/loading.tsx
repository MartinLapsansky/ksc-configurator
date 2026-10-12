import TopBanner from "@/components/layout/TopBanner";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function ShopLoading() {
  return (
    <main className="w-full min-h-screen bg-white">
      <TopBanner />
      <Breadcrumbs />

      <section className="w-full px-4 mt-5 md:px-8 lg:px-8">
        <div className="mx-auto h-full w-full grid grid-cols-2 gap-6 pb-6 pt-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl 2xl:max-w-480">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex min-w-0 flex-col items-center">
              <div className="shimmer aspect-5/7 w-full min-w-0 max-w-85 rounded-lg border border-gray-200 shadow-sm 2xl:max-w-105" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}