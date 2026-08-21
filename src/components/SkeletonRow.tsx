export default function SkeletonRow({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3 py-4 px-4 sm:px-6 lg:px-8">
      <div className="h-6 w-48 bg-neutral-800/80 rounded animate-pulse" />
      <div className="flex items-center gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex-none w-[150px] sm:w-[180px] lg:w-[200px] aspect-[2/3] rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse relative p-3 flex flex-col justify-end"
          >
            <div className="h-4 w-3/4 bg-neutral-800 rounded mb-2" />
            <div className="h-3 w-1/2 bg-neutral-800/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
