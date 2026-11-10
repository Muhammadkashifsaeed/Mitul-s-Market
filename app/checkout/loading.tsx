export default function CheckoutLoading() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="h-5 w-44 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-4 space-y-2.5">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded-lg bg-gray-200/80" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-7 shadow-xs" />
            <div className="h-80 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-7 shadow-xs" />
          </div>
          <div className="h-96 animate-pulse rounded-[28px] border border-gray-200/80 bg-white p-7 shadow-sm" />
        </div>
      </section>
    </main>
  );
}

