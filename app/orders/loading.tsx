export default function OrdersLoading() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="space-y-2.5">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded-lg bg-gray-200/80" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-[22px] border border-gray-200/80 bg-white p-5 shadow-xs"
            />
          ))}
        </div>

        <div className="mt-8 h-32 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-xs" />
        <div className="mt-5 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

