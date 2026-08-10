export default function AndDivider() {
  return (
    <div className="flex items-center justify-center gap-4 bg-white px-5 py-10">
      <span className="h-px max-w-24 flex-1 bg-black/15" aria-hidden />
      <span className="bg-accent px-3 py-1 text-2xl font-black italic tracking-tight text-black sm:text-3xl">
        AND
      </span>
      <span className="h-px max-w-24 flex-1 bg-black/15" aria-hidden />
    </div>
  );
}
