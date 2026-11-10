export default function ProductDetailLoading() {
  return (
    <main className="w-full flex-1 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mb-6 h-5 w-60 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-8 rounded-[28px] border border-gray-200/80 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="aspect-square w-full animate-pulse rounded-[22px] bg-gray-200" />
          <div className="space-y-5">
            <div className="h-6 w-36 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-4/5 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-5 w-44 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200" />
              <div className="h-12 flex-1 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

