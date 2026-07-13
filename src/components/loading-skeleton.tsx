export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6" aria-busy="true" aria-live="polite">
      <div className="mb-10 space-y-3">
        <div className="h-3 w-28 rounded-full bg-line animate-pulse" />
        <div className="h-10 w-48 rounded-2xl bg-line animate-pulse" />
        <div className="h-4 w-72 max-w-full rounded-full bg-line animate-pulse" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass flex min-h-[360px] items-center justify-center rounded-[32px]">
          <div className="h-48 w-48 rounded-full border border-line animate-pulse" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-[24px] border border-line bg-white/20 animate-pulse dark:bg-white/[0.03]" />
          ))}
        </div>
      </div>
      <span className="sr-only">Carregando Cadence…</span>
    </div>
  );
}
