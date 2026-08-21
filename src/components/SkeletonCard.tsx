export default function SkeletonCard({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-[130px] sm:w-[150px]",
    md: "w-[150px] sm:w-[180px]",
    lg: "w-[180px] sm:w-[220px]",
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <div className="skeleton rounded-lg aspect-[2/3] w-full" />
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-2.5 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-[60vh] sm:h-[80vh] skeleton">
      <div className="absolute bottom-0 left-0 p-8 lg:p-16 space-y-4 w-full md:w-2/3">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-12 w-96 rounded" />
        <div className="skeleton h-4 w-80 rounded" />
        <div className="skeleton h-4 w-72 rounded" />
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-12 w-36 rounded-lg" />
          <div className="skeleton h-12 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-[var(--sn-bg)] pt-20">
      <div className="skeleton h-[50vh]" />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        <div className="skeleton h-10 w-96 rounded" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-6 w-20 rounded-full" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-4/6 rounded" />
        </div>
      </div>
    </div>
  );
}
