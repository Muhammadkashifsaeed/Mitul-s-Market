export default function CartLoading() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <div className="h-10 w-56 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-5 w-80 max-w-full animate-pulse rounded-lg bg-gray-200/80" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_410px]">
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs"
              />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-[28px] border border-gray-200/80 bg-white p-7 shadow-sm" />
        </div>
      </section>
    </main>
  );
}

