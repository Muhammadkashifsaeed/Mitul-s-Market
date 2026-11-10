export default function OrderDetailsLoading() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-6 h-28 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs" />
        <div className="mt-6 h-40 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="h-72 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs" />
          <div className="h-72 animate-pulse rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-xs" />
        </div>
      </div>
    </main>
  );
}

