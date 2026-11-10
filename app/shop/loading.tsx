export default function ShopLoading() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="space-y-3">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-5 w-52 animate-pulse rounded-lg bg-gray-200/80" />
        </div>

        <div className="mt-8 h-24 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-4 shadow-xs" />

        <div className="mt-8 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-7">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-gray-200/80 bg-white p-3.5 shadow-sm"
            >
              <div className="aspect-[388/320] w-full animate-pulse rounded-[20px] bg-gray-200" />
              <div className="space-y-3 px-2 pb-2 pt-4">
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200/80" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-7 w-20 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

